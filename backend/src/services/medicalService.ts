import {
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

const createMedicalRecord = async (doctorId: number, patientId: number, appointmentId: number, healthConcern: string, prescription: any,instructions: string = '', imageUrl: string | null) => {
    return await prisma.medicalRecord.create({
        data: {
          doctorId: Number(doctorId),
          patientId: Number(patientId),
          appointmentId: Number(appointmentId),
          healthConcern,
          prescription, // Ensure JSON format
          instructions,
          image: imageUrl,
        },
      });
}

export const medicalService = {
    createMedicalRecord
}