import { PrismaClient, Chat, Message, User } from "@prisma/client";

const prisma = new PrismaClient();

export const chatService = {
  // Get chat rooms by user, filtering by userId and role
  async getChatRoomsByUser(userId: number, role: "doctor" | "patient") {
    return await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            user: { id: userId }, // Check if the user exists in the participants relation
          },
        },
      },
      select: { id: true }, // Select the fields you need
    });
  },

  // Get all chats for a specific user, ensuring participants are returned as User[]
  async getAllChats(userId: number) {
    return await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            user: { id: userId }, // Check if the user is part of the participants array
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                role:true,
                profilePic: {
                  select: {
                    id: true,
                    // imageData: true,
                    imageName: true, 
                  },
                },
                doctor:{
                  select:{
                    specialization: true
                  }
                }
              },
            },
          },
        },
      },
    });
  },

  async getMessagesByChat(chatId: number): Promise<Message[]> {
    return await prisma.message.findMany({
      where: {
        chatId, // Fetch messages for the specified chat
        isDeleted: false, // Only fetch non-deleted messages
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            role: true
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Order messages by creation time in descending order
      },
    });
  },

  async getLastMessage(chatId: number) {
    return await prisma.message.findFirst({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Save a message to a chat room
  async saveMessage(
    chatId: number,
    senderId: number,
    message: string
  ): Promise<Message> {
    return await prisma.message.create({
      data: {
        chatId,
        senderId,
        message,
        isDeleted: false,
        createdAt: new Date(),
      },
    });
  },
  
};
