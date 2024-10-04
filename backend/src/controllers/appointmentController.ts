import { Request, Response } from "express";
import { appointmentService } from "../services/appointmentService";

const createAppointment = async (req: Request, res: Response) => {
    const { userId, patientId, appointmentDate, type } = req.body;

    try {
        // Check if user is a doctor
        const doctor = appointmentService.findDoctor(Number(userId))

        if (!doctor) {
            return res.status(400).json({ error: 'User is not a doctor' });
        }

        // Create appointment
        const appointment = await appointmentService.createAppointment(doctor.id, patientId, appointmentDate, type)

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Error creating appointment' });
    }
}

const getAppointments = async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
        // Fetch appointments for the given userId (as doctor or patient)
        const appointments = await appointmentService.getAppointments(userId)

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching appointments' });
    }
}

const updateAppointment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, status } = req.body;

    try {
        // Check if the user is the doctor for the appointment
        const appointment = await appointmentService.findAppointment(id)

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (appointment.doctorId !== Number(userId)) {
            return res.status(403).json({ error: 'Only the doctor can update the status' });
        }

        // Update appointment status
        const updatedAppointment = await appointmentService.updateAppointmentStatus(id, status)

        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ error: 'Error updating appointment status' });
    }
}

export const appointmentController = {
    createAppointment,
    getAppointments,
    updateAppointment
};