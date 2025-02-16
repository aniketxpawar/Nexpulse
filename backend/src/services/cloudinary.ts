import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const convertBase64ToUrl = async (imageBuffer: Buffer) => {
    try {
        // Convert buffer to base64
        const base64String = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(base64String, {
            folder: "medical_records",
            resource_type: "image",
        });

        return uploadResponse.secure_url;
    } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        return null;
    }
};

