import { Request, Response } from "express";
import { appointmentService } from "../services/appointmentService";
import {
    isSameDay,
  parseISO,
  isWithinInterval,
  addMinutes,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { userService } from "../services/userService";
import { Appointment } from "@prisma/client";

// Utility to get weekday name from a date
const getWeekdayName = (date: Date): string => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[date.getDay()];
};

const normalizeToSameDay = (time: Date, date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
  };
  
  const getAvailableSlots = async (req: Request, res: Response) => {
    const { doctorId, date } = req.body;

    // Validate input parameters
    if (!doctorId || !date) {
        return res.status(400).json({ error: "Doctor ID and date are required." });
    }

    try {
        // Convert date to Date object and normalize to UTC
        const appointmentDate = new Date(date);
        appointmentDate.setUTCHours(0, 0, 0, 0); // Normalize to start of the day in UTC

        // Step 1: Retrieve doctor's availability and appointments on that date
        const doctor = await appointmentService.getDoctorWithDateAppointments(Number(doctorId), appointmentDate);

        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        // Step 2: Get available slots for the specified day
        const dayOfWeek = getWeekdayName(appointmentDate); // Get the correct day name
        const availableSlots: string[] = doctor.availability[dayOfWeek] || [];
        const bookedSlots = doctor.appointments.map((app: any) => app.appointmentDate);

        // Step 3: Filter out booked slots
        const freeSlots = availableSlots.filter((slot) => {
            const slotStart = normalizeToSameDay(parseISO(slot), appointmentDate);
            const slotEnd = addMinutes(slotStart, 29); // 30-minute slot duration

            // Check if the slot overlaps with any booked appointment based on time
            const isOverlapping = bookedSlots.some((booked: any) => {
                const bookedTime = normalizeToSameDay(new Date(booked), appointmentDate);
                return isWithinInterval(bookedTime, { start: slotStart, end: slotEnd });
            });

            // Only return slots that are not overlapping in time
            return !isOverlapping && isSameDay(slotStart, appointmentDate);
        });

        // Step 4: Return the available slots
        res.status(200).json({ availableSlots: freeSlots.map((time) => normalizeToSameDay(new Date(time), appointmentDate)) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


  const generateMeetingCode = (): string => {
    // Generate a random alphanumeric code of length 10
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  };
  

  const createAppointment = async (req: Request, res: Response) => {
    const { userId, doctorId,healthConcern, appointmentDate, type } = req.body;
  
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
      const meetingCode = crypto.randomUUID()
      // TO DO: CHECK IF A CODE IS ALREADY USED OR NOT
      const link = type == "online" ? "http://localhost:5173/meeting/"+meetingCode : null
  
      // Step 3: Create appointment with meeting code
      const appointment = await appointmentService.createAppointmentRecord(doctor.id, patient.id, appointmentDate,healthConcern, type, link);
  
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
        const user = await userService.getUserById(Number(userId))
        if(!user) return res.status(404).json({message:"User not found"})

        let appointments: Appointment[] = []

        if (user.role === "patient" && user.patient) {
          // Check if the user has a patient record
          appointments = await appointmentService.getAppointments(user.patient.id, 'patient') || [];
        } else if (user.role === "doctor" && user.doctor) {
          // Check if the user has a doctor record
          appointments = await appointmentService.getAppointments(user.doctor.id, 'doctor') || [];
        }

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching appointments' });
    }
}

const getTodaysAppointment = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
      // Check if user is a doctor
      const user = await userService.getUserById(Number(userId));
      if (!user || user.role !== 'doctor') {
          return res.status(403).json({ message: "User is not authorized to access this resource" });
      }

      // Fetch today's date in a format compatible with your database
      const today = new Date();
const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0));
const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999));


      // Retrieve today's appointments for the doctor
      const appointments = user?.doctor?.id ? await appointmentService.getTodaysAppointment(user.doctor.id,startOfDay,endOfDay) : []

      res.status(200).json(appointments);
  } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      res.status(500).json({ error: 'Error fetching today\'s appointments' });
  }
};

// const updateAppointment = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const { userId, status } = req.body;

//     try {
//         // Check if the user is the doctor for the appointment
//         const appointment = await appointmentService.findAppointment(id)

//         if (!appointment) {
//             return res.status(404).json({ error: 'Appointment not found' });
//         }

//         if (appointment.doctorId !== Number(userId)) {
//             return res.status(403).json({ error: 'Only the doctor can update the status' });
//         }

//         // Update appointment status
//         const updatedAppointment = await appointmentService.updateAppointmentStatus(id, status)

//         res.status(200).json(updatedAppointment);
//     } catch (error) {
//         res.status(500).json({ error: 'Error updating appointment status' });
//     }
// }

export const appointmentController = {
  createAppointment,
  getAppointments,
  getTodaysAppointment,
  // updateAppointment,
  getAvailableSlots,
};
