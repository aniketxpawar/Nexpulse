import { Doctor, PrismaClient, Role } from '@prisma/client';

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

const checkChatExists = async (patientId: number, doctorId: number): Promise<boolean> => {
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

  return chatRecord !== null; // Return true if chat exists, false otherwise
};

export const userService = { createUser, getUserByEmail, updateUserProfile,createDoctorProfile,createPatientProfile, getDoctorsRecord, checkChatExists}
