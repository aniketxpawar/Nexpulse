import { Request, Response } from "express";
import { convertBase64ToUrl } from "../services/cloudinary";
import { medicalService } from "../services/medicalService";
import { userService } from "../services/userService";
import {
  getValueByKey,
  setKeyValueWithExpiry,
} from "../services/redisServices";
import { randomUUID } from "crypto";
import { sendEmail } from "../services/sendEmail";

const createRecord = async (req: Request, res: Response) => {
  try {
    const {
      doctorId,
      patientId,
      appointmentId,
      healthConcern,
      prescription,
      instructions,
    } = req.body;
    const image = req.file;

    let imageUrl: string | null = null;
    if (image) {
      imageUrl = await convertBase64ToUrl(image.buffer);
    }

    // Store the medical record in the database
    const record = await medicalService.createMedicalRecord(
      Number(doctorId),
      Number(patientId),
      Number(appointmentId),
      healthConcern,
      prescription,
      instructions,
      imageUrl
    );

    return res.status(201).json({ message: "Medical Record Created", record });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMedicalRecords = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { requestingUserId } = req.body;

    // Validate IDs
    if (!patientId || !requestingUserId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const patient = await userService.getPatientRecord(Number(patientId));
    const doctor = await userService.getDoctorsRecord(Number(requestingUserId));

    if (!patient) {
      return res.json([]); // Return empty array if the user is not a patient
    }

    const accessDoctorId = await getValueByKey(`access:${patientId}`);

    // If the requesting user is the same as the patient, return all records
    if (
      Number(patientId) === Number(requestingUserId) ||
      Number(accessDoctorId) == Number(requestingUserId)
    ) {
      const medicalRecords =
        await medicalService.getAllMedicalRecordsForPatient(Number(patient.id));
      return res.json(medicalRecords);
    }
    if (!doctor) {
      return res.json([]); // Return empty array if the user is not a patient
    }

    // Otherwise, return only records prescribed by the requesting doctor
    const medicalRecords = await medicalService.getMedicalRecordsByDoctor(
      Number(patient.id),
      Number(doctor.id)
    );

    return res.json(medicalRecords);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const requestAccess = async (req: Request, res: Response) => {
  const { doctorId, patientId } = req.body;

  const key = randomUUID();
  const success = await setKeyValueWithExpiry(
    key,
    `${patientId}-${doctorId}`,
    60 * 60 * 24
  );

  const patient = await userService.getPatientRecord(Number(patientId));
  const doctor = await userService.getDoctorsRecord(Number(doctorId));

  if (!patient) {
    return res.status(404).json({ message: "Patient Not Found" }); // Return empty array if the user is not a patient
  }

  sendEmail(
    // @ts-ignore
    patient?.user?.email,
    "Access Requested",
    // @ts-ignore
    `Click on the below link to give access to Dr.${doctor?.user?.fullName}: \n http://localhost:3000/verify-access?key=${key}`
  );

  res.json({ message: "Please check your email" });
};

export const medicalController = {
  createRecord,
  getMedicalRecords,
  requestAccess,
};