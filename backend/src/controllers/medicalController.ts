import { Request, Response } from "express";
import { convertBase64ToUrl } from "../services/cloudinary";
import { medicalService } from "../services/medicalService";

const createRecord = async(req: Request,res: Response) => {
    try{
        const {doctorId, patientId, appointmentId, healthConcern, prescription, instructions} = req.body
        const image = req.file;

        let imageUrl: string | null = null;
    if (image) {
      imageUrl = await convertBase64ToUrl(image.buffer);
    }

    // Store the medical record in the database
    const record = await medicalService.createMedicalRecord(Number(doctorId),Number(patientId),Number(appointmentId),healthConcern,prescription,instructions,imageUrl)

    return res.status(201).json({ message: "Medical Record Created", record });

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}
export const medicalController = {
    createRecord
  };