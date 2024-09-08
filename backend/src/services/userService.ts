import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient()

const createUser = async ({
    fullName,
    password,
    phone,
    email,
    city,
    role,
  }:{
    fullName: string,
    password: string,
    phone:string,
    email:string,
    city:string,
    role: Role,
  }) => {
    const user = await prisma.user.create({
        data: {
          fullName,
          password,
          phone,
          email,
          city,
          role,
        },
      });
      return user;
}

export const userService = {createUser}