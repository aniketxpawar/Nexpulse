import { Router } from 'express';
import userRouter from './userRouter';
import chatRouter from './chatRouter';
import appointmentRouter from './appointmentRouter'

const router = Router();

// Combine all routers
router.use('/user', userRouter);
router.use('/chat', chatRouter);
router.use('/appointment',appointmentRouter)

export default router;
