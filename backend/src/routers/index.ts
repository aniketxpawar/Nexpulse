import { Router } from 'express';
import userRouter from './userRouter';

const router = Router();

// Combine all routers
router.use('/user', userRouter);

export default router;
