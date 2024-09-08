import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Add some sample data
  const user = await prisma.user.create({
    data: {
      fullName: "John Doe",
      email: "john@example.com",
      password: "Aniket123",
      phone:"9876543210",
      city:"Mumbai",
      role:"PATIENT"
    },
  });

  console.log({ user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
