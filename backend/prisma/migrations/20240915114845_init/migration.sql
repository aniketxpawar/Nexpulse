-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "imageData" BYTEA NOT NULL,
    "imageName" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
