import { Request, Response } from "express";
import { chatService } from "../services/chatService";


const getMessagesByChatId = async (req: Request,res: Response) => {
    const chatId = Number(req.params.chatId)

    const messages = await chatService.getMessagesByChat(chatId)

    res.status(200).json({messages})
}

export const chatController = {
    getMessagesByChatId
}