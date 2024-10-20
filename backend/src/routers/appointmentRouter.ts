import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController';

const router = Router()

router.post('/get-slots', appointmentController.getAvailableSlots);
router.post('/createAppointment', appointmentController.createAppointment);
// router.get('/getAppointments', appointmentController.getAppointments);
// router.patch('/updateAppointment/:id', appointmentController.updateAppointment);

export default router;