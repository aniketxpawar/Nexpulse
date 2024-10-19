import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router()

router.post('/signup', userController.signup)
router.post('/validate-otp', userController.validateOTP)
router.post('/login', userController.login)
router.post('/set-profile', userController.setProfile)
router.post('/get-doctor', userController.getDoctorById)
router.get('/get-specialist', userController.getSpecialist)

export default router;