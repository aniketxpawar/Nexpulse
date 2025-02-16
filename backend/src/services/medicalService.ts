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

const getAllMedicalRecordsForPatient = async (patientId: number) => {
  return prisma.medicalRecord.findMany({
    where: { patientId },
    include: { doctor: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
};

// Function to get medical records prescribed by a specific doctor
const getMedicalRecordsByDoctor = async (
  patientId: number,
  doctorId: number
) => {
  return prisma.medicalRecord.findMany({
    where: {
      patientId,
      doctorId,
    },
    include: { doctor: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const medicalService = {
  createMedicalRecord,
  getAllMedicalRecordsForPatient,
  getMedicalRecordsByDoctor,
};