import {
  AppointmentStatus,
  AppointmentType,
  Doctor,
  Patient,
  Prisma,
  PrismaClient,
  Role,
} from "@prisma/client";

const prisma = new PrismaClient();

const findDoctor = async (userId: number): Promise<Doctor | null> => {
  return await prisma.doctor.findUnique({
    where: { userId },
  });
};

const findPatient = async (userId: number): Promise<Patient | null> => {
  return await prisma.patient.findUnique({
    where: { userId },
  });
};

const getDoctorWithDateAppointments = async (
  doctorId: number,
  appointmentDate: Date
): Promise<any> => {
  return await prisma.doctor.findUnique({
    where: { userId: doctorId },
    select: {
      availability: true,
      appointments: {
        where: {
          appointmentDate: {
            gte: appointmentDate,
            lt: new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000), // Filter appointments on the same day
          },
          status: "scheduled", // Consider only scheduled appointments
        },
        select: {
          appointmentDate: true,
        },
      },
    },
  });
};

const getDoctorAvailability = async (doctorId: number): Promise<any> => {
  const doctor = await prisma.doctor.findUnique({
    where: { userId: doctorId },
    select: { availability: true },
  });
  return doctor?.availability || {};
};

const updateDoctorAvailability = async (
  doctorId: number,
  availability: Record<string, any> // Ensure correct typing
) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: doctorId },
      select: { availability: true },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    // Ensure existing availability is a valid object
    const existingAvailability =
      typeof doctor.availability === "object" && doctor.availability !== null
        ? (doctor.availability as Record<string, any>)
        : {};

    // Merge availability
    const mergedAvailability: Prisma.InputJsonValue = {
      ...existingAvailability,
      ...availability,
    };

    // Update the availability field in the database
    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        availability: mergedAvailability, // Ensure correct Prisma JSON type
      },
    });

    return updatedDoctor;
  } catch (error) {
    console.error("Error updating doctor availability:", error);
    return null;
  }
};

const createAppointmentRecord = async (
  doctorId: number,
  patientId: number,
  appointmentDate: Date,
  healthConcern: string | null,
  type: AppointmentType,
  link: string | null
) => {
  return await prisma.appointment.create({
    data: {
      doctorId: doctorId,
      patientId: patientId,
      appointmentDate: new Date(appointmentDate).toISOString(),
      healthConcern: healthConcern,
      type: type,
      link: link,
      status: "scheduled",
    },
  });
};

const getAppointments = async (userId: number, role: Role) => {
  // Construct the ⁠ where ⁠ clause based on the user's role
  const whereClause =
    role === Role.patient ? { patientId: userId } : { doctorId: userId };

  return await prisma.appointment.findMany({
    where: {
      ...whereClause, // Apply the constructed ⁠ where ⁠ clause
      status: "scheduled",
    },
    include: {
      doctor: {
        include: {
          user: true, // Include user details for the doctor
        },
      },
      patient: {
        include: {
          user: true, // Include user details for the patient
        },
      },
    },
    orderBy: {
      appointmentDate: "asc", // Order by createdAt in descending order
    },
  });
};

const getTodaysAppointment = async (
  doctorId: number,
  startOfDay: Date,
  endOfDay: Date
) => {
  return await prisma.appointment.findMany({
    where: {
      doctorId: doctorId,
      appointmentDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      patient: true, // Populate patient data
    },
  });
};

const findAppointment = async (id: string) => {
  return await prisma.appointment.findUnique({
    where: { id: Number(id) },
  });
};

const updateAppointmentStatus = async (
  id: number,
  status: AppointmentStatus
) => {
  return await prisma.appointment.update({
    where: { id: Number(id) },
    data: { status },
  });
};

export const appointmentService = {
  findDoctor,
  findPatient,
  getDoctorWithDateAppointments,
  getDoctorAvailability,
  updateDoctorAvailability,
  createAppointmentRecord,
  getAppointments,
  getTodaysAppointment,
  findAppointment,
  updateAppointmentStatus,
};
