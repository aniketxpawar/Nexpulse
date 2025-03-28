import { Doctor, Patient, PrismaClient, Role, User  } from '@prisma/client';

const prisma = new PrismaClient()

const createUser = async ({
    fullName,
    password,
    email,
    role,
  }:{
    fullName: string,
    password: string,
    email:string,
    role: Role,
  }) => {
    const user = await prisma.user.create({
      data: {
        fullName,
        password,
        email,
        role,
      },
    });
    return user;
}

const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      role: true,
      password: true,
      doctor: true,
      patient: true
    },
  });
}

const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      role: true,
      doctor: true,
      patient: true
    },
  });
}

const updateUserProfile = async (userId: number, data: any) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

const createDoctorProfile = async (userId: number, doctorData: any) => {
  const { specialization, experience, availability, licenseNumber, licenseAuthority, licenseExpiry, consultationCharge, clinicAddress, profile } = doctorData;

  if (!specialization || !experience || !licenseNumber || !licenseAuthority || !licenseExpiry || !consultationCharge || !clinicAddress) {
    throw new Error('All doctor fields are required');
  }

  return prisma.doctor.create({
    data: {
      userId,
      specialization,
      experience,
      availability,
      licenseNumber,
      licenseAuthority,
      licenseExpiry: new Date(licenseExpiry),
      consultationCharge,
      clinicAddress,
      profile,
    },
  });
};

const createPatientProfile = async (userId: number, patientData: any) => {
  const { dob, gender } = patientData;

  if (!dob || !gender) {
    throw new Error('Date of birth and gender are required');
  }

  return prisma.patient.create({
    data: {
      userId,
      dob: new Date(dob),
      gender,
    },
  });
};

const getDoctorsRecord = async (doctorId: number): Promise<Doctor | null> => {
  return await prisma.doctor.findUnique({
    where: { userId: doctorId },
    include: {
      user: true, // Include user details if needed
    },
  });
}

const getPatientRecord = async (patientId: number): Promise<Patient | null> => {
  return await prisma.patient.findUnique({
    where: { userId: patientId },
    include: { user: true }, // Include patient details
  });
}

const checkChatExists = async (patientId: number, doctorId: number): Promise<{exists: boolean, chatId: number | null}> => {
  const chatRecord = await prisma.chatParticipant.findFirst({
    where: {
      userId: patientId,
      chat: {
        participants: {
          some: {
            userId: doctorId,
          },
        },
      },
    },
    // include: {
    //   chat: true, // Include chat details if needed
    // },
  });

  return {
    exists: chatRecord !== null,
    chatId: chatRecord?.chatId || null,
  };
};

const getDoctorsBySpecialist = async (specialists: string[]) => {
  const specializationFilters = specialists.map((specialist: string) => ({
    specialization: {
      contains: specialist,
      mode: 'insensitive' as const,  // Use 'insensitive' as a constant
    },
  }));

  const doctors = await prisma.doctor.findMany({
    where: {
      OR: specializationFilters,  // Match any specialization in the array
    },
    include: {
      user: true,  // Include related user details
    },
  });

  return doctors; // Don't forget to return the found doctors
};

const getAllDoctors = async () => {
  return await prisma.doctor.findMany({
    include:{
      user: true
    }
  })
}

export const userService = { createUser, getUserByEmail, getUserById, updateUserProfile,createDoctorProfile,createPatientProfile, 
  getDoctorsRecord,getPatientRecord, checkChatExists, getDoctorsBySpecialist, getAllDoctors}
