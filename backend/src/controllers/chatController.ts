import { Request, Response } from "express";
import { chatService } from "../services/chatService";

const createChatroom = async (req: Request, res: Response) => {
    const { participants } = req.body;

    // Validate input parameters
    if (!Array.isArray(participants) || participants.length === 0) {
        return res.status(400).json({ error: 'Invalid input parameters.' });
    }

    try {
        // Create a new chat record
        const newChat = await chatService.createChatroom(participants)

        res.status(201).json({ chat: newChat });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getMessagesByChatId = async (req: Request,res: Response) => {
    const chatId = Number(req.params.chatId)

    const messages = await chatService.getMessagesByChat(chatId)

    res.status(200).json({messages})
}

export const chatController = {
    getMessagesByChatId,
    createChatroom
}