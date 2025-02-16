import { Router } from 'express';
import multer from 'multer';
import { medicalController } from '../controllers/medicalController';

const router = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/createRecord',upload.single("image"), medicalController.createRecord);
router.post("/medicalRecords/:patientId", medicalController.getMedicalRecords);
router.post("/requestAccess", medicalController.requestAccess);

export default router;