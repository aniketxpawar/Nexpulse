import { Request, Response } from "express";
import { appointmentService } from "../services/appointmentService";
import { endOfDay, isWithinInterval } from "date-fns";
import { userService } from "../services/userService";
import { Appointment } from "@prisma/client";
import moment from "moment";

const getAvailableSlots = async (req: Request, res: Response) => {
  const { doctorId, date, day } = req.body;

  // Validate input parameters
  if (!doctorId) {
    return res.status(400).json({ error: "Doctor ID is required." });
  }

  try {
    if (!date) {
      const availability = await appointmentService.getDoctorAvailability(
        Number(doctorId)
      );
      return res.status(200).send(availability);
    }

    // Ensure date is treated as an epoch timestamp (seconds)
    const appointmentDate = moment.unix(date).startOf("day").unix();

    // Step 1: Retrieve doctor's availability and appointments on that date
    const doctor = await appointmentService.getDoctorWithDateAppointments(
      Number(doctorId),
      appointmentDate
    );

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Step 2: Get available slots for the specified day
    const availableSlots: { start: number; end: number }[] =
      doctor.availability[day] || [];
    const bookedSlots: number[] = doctor.appointments.map(
      (app: any) => app.appointmentDate // Already in epoch format
    );

    // Filter out booked slots
    const freeSlots = availableSlots.filter(({ start, end }) => {
      return !bookedSlots.some((booked) => booked >= start && booked < end);
    });

    // Step 4: Return the available slots
    res.status(200).json({
      availableSlots: freeSlots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const setAvailability = async (req: Request, res: Response) => {
  const { doctorId, availability } = req.body;
  const allowedDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  if (
    !availability ||
    typeof availability !== "object" ||
    Object.keys(availability).some((day) => !allowedDays.includes(day))
  ) {
    return res.status(400).json({ error: "Invalid availability day" });
  }

  // Ensure availability data is properly formatted with epoch times
  const updatedAvailability = Object.entries(availability).reduce(
    (acc, [day, slots]) => {
      if (!Array.isArray(slots)) return acc; // Ignore invalid entries

      acc[day] = slots.map((slot) => {
        return {
          start: Number(slot.start), // Ensure it's a number (epoch time)
          end: Number(slot.end), // Ensure it's a number (epoch time)
        };
      });

      return acc;
    },
    {} as Record<string, { start: number; end: number }[]>
  );

  const updatedDoctor = await appointmentService.updateDoctorAvailability(
    Number(doctorId),
    updatedAvailability
  );

  if (!updatedDoctor) {
    return res.status(400).json({ message: "Failed to set availability" });
  }

  res.status(200).json({ message: "Availability set successfully" });
};

const createAppointment = async (req: Request, res: Response) => {
  const { userId, doctorId, healthConcern, appointmentDate, type } = req.body;

  try {
    const doctor = await appointmentService.findDoctor(Number(doctorId));

    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    const patient = await appointmentService.findPatient(Number(userId));

    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }

    // Step 2: Generate a unique meeting code
    const meetingCode = crypto.randomUUID();
    // TO DO: CHECK IF A CODE IS ALREADY USED OR NOT
    const link =
      type == "online" ? "http://localhost:8080/" + meetingCode : null;

    // Step 3: Create appointment with meeting code
    const appointment = await appointmentService.createAppointmentRecord(
      doctor.id,
      patient.id,
      appointmentDate,
      healthConcern,
      type,
      link
    );

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating appointment" });
  }
};

const getAppointments = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Fetch appointments for the given userId (as doctor or patient)
    const user = await userService.getUserById(Number(userId));
    if (!user) return res.status(404).json({ message: "User not found" });

    let appointments: Appointment[] = [];

    if (user.role === "patient" && user.patient) {
      // Check if the user has a patient record
      appointments =
        (await appointmentService.getAppointments(
          user.patient.id,
          "patient"
        )) || [];
    } else if (user.role === "doctor" && user.doctor) {
      // Check if the user has a doctor record
      appointments =
        (await appointmentService.getAppointments(user.doctor.id, "doctor")) ||
        [];
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching appointments" });
  }
};

const getPastAppointments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { date } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ message: "Missing userId or date" });
    }

    const user = await userService.getUserById(Number(userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const appointments = await appointmentService.getPastAppointmentsByRole({
      doctorId: user.doctor?.id,
      patientId: user.patient?.id,
      date: date,
    });

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching past appointments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTodaysAppointment = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { startOfDay } = req.body; // Received in epoch format (seconds)

  try {
    // Check if user is a doctor
    const user = await userService.getUserById(Number(userId));
    if (!user || user.role !== "doctor") {
      return res
        .status(403)
        .json({ message: "User is not authorized to access this resource" });
    }

    // Calculate endOfDay in epoch format (add 86400 seconds = 24 hours)
    const endOfDay = startOfDay + 86400;

    // Retrieve today's appointments for the doctor
    const appointments = user?.doctor?.id
      ? await appointmentService.getTodaysAppointment(
          user.doctor.id,
          startOfDay,
          endOfDay
        )
      : [];

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({ error: "Error fetching today's appointments" });
  }
};

  export const appointmentController = {
    setAvailability,
    createAppointment,
    getAppointments,
    getPastAppointments,
    getTodaysAppointment,
    // updateAppointment,
    getAvailableSlots,
  };
