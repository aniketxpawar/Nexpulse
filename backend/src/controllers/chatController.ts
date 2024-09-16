import { Request, Response } from "express"

const getMessagesByChatId = async (req: Request,res: Response) => {
res.send("hi")
}

export const chatController = {
    getMessagesByChatId
}