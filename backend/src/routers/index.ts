import { Router } from 'express';
import userRouter from './userRouter';
import chatRouter from './chatRouter';
import medicalRouter from "./medicalRouter";
import appointmentRouter from "./appointmentRouter";

const router = Router();

// Combine all routers
router.use("/user", userRouter);
router.use("/chat", chatRouter);
router.use("/appointment", appointmentRouter);
router.use("/medical", medicalRouter);

export default router;
