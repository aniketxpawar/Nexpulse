import fs from 'fs';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function insertImage(imagePath:string, imageName:string) {
  const imageData = fs.readFileSync(imagePath);

  await prisma.image.create({
    data: {
      imageData,
      imageName,
      userId: 2
    },
  });
}

// Usage example
insertImage('./prisma/models/patient-image.webp', 'Manish Gupta Image')
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
