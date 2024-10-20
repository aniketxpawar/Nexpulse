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
      const appointmentDate = parseISO(date); // Convert date to Date object
  
      // Step 1: Retrieve doctor's availability and appointments on that date
      const doctor = await appointmentService.getDoctorWithDateAppointments(Number(doctorId), appointmentDate);
  
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
  
      // Step 2: Get available slots for the specified day
      const dayOfWeek = getWeekdayName(appointmentDate);
      const availableSlots: string[] = doctor.availability[dayOfWeek] || [];
      const bookedSlots = doctor.appointments.map((app: any) => app.appointmentDate);
  
      // Step 3: Filter out booked slots
      const appointmentDateStart = appointmentDate.getTime();
  
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
      res.status(200).json({ availableSlots: freeSlots?.map((time) => normalizeToSameDay(new Date(time), appointmentDate)) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

const createAppointment = async (req: Request, res: Response) => {
  const { userId, doctorId, appointmentDate, type } = req.body;

  try {
    // Check if user is a doctor
    const doctor = await appointmentService.findDoctor(Number(doctorId));

    if (!doctor) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    // Create appointment
    const appointment = await appointmentService.createAppointment(
      doctor.id,
      userId,
      appointmentDate,
      type
    );

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Error creating appointment" });
  }
};

// const getAppointments = async (req: Request, res: Response) => {
//     const { userId } = req.query;

//     try {
//         // Fetch appointments for the given userId (as doctor or patient)
//         const appointments = await appointmentService.getAppointments(userId)

//         res.status(200).json(appointments);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching appointments' });
//     }
// }

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
  // getAppointments,
  // updateAppointment,
  getAvailableSlots,
};
