import { AppointmentStatus, AppointmentType, Doctor, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findDoctor = async (userId: number) => {
    return await prisma.doctor.findUnique({
        where: { userId },
    });
}

const createAppointment = async (doctorId: number, patientId: number, appointmentDate: Date, type: AppointmentType) => {
    return await prisma.appointment.create({
        data: {
            doctorId: doctorId,
            patientId: patientId,
            appointmentDate: new Date(appointmentDate),
            type: type,
            status: 'scheduled',  // Default status when creating an appointment
        },
    });
}

const getAppointments = async (userId: string) => {
    return await prisma.appointment.findMany({
        where: {
            OR: [
                { doctorId: Number(userId) },
                { patientId: Number(userId) },
            ],
        },
        include: {
            doctor: true,
            patient: true,
        },
    });
}

const findAppointment = async (id: string) => {
    return await prisma.appointment.findUnique({
        where: { id: Number(id) },
    });
}

const updateAppointmentStatus = async (id: number, status: AppointmentStatus) => {
    return await prisma.appointment.update({
        where: { id: Number(id) },
        data: { status },
    });
}

export const appointmentService = {
    findDoctor,
    createAppointment,
    getAppointments,
    findAppointment,
    updateAppointmentStatus
}