import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController';

const router = Router()

router.post('/get-slots', appointmentController.getAvailableSlots);
router.post('/createAppointment', appointmentController.createAppointment);
router.get('/getAppointments/:userId', appointmentController.getAppointments);
router.post(
  "/getPastAppointments/:userId",
  appointmentController.getPastAppointments
);
router.get('/getTodaysAppointments/:userId', appointmentController.getTodaysAppointment);
router.post("/availability", appointmentController.setAvailability);
// router.patch('/updateAppointment/:id', appointmentController.updateAppointment);

export default router;