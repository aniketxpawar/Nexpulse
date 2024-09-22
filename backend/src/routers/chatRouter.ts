import { Router } from 'express';
import { chatController } from '../controllers/chatController';

const router = Router()

router.get('/getMessagesByChatId/:chatId',chatController.getMessagesByChatId )

export default router;