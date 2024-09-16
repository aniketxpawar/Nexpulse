import { Router } from 'express';
import userRouter from './userRouter';
import chatRouter from './chatRouter'

const router = Router();

// Combine all routers
router.use('/user', userRouter);
router.use('/chat', chatRouter);

export default router;
