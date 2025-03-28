import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router()

router.post('/signup', userController.signup)
router.post('/validate-otp', userController.validateOTP)
router.post('/login', userController.login)
router.post('/set-profile', userController.setProfile)
router.post('/get-doctor', userController.getDoctorById)
router.post('/get-patient', userController.getPatientById)
router.get('/get-specialist', userController.getSpecialist)
router.get('/get-tags', userController.getTags)

router.post('/getDoctors',userController.getDoctors)

export default router;