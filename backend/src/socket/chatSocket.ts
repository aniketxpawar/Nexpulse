import { Server, Socket } from "socket.io";
import { chatService } from "../services/chatService";
import { User } from "@prisma/client";

interface UserConnection {
  userId: number;
  role: "doctor" | "patient";
}

interface Message {
  chatId: number;
  senderId: number;
  message: string;
}

interface Chat {
  id: number;
  participants: User[]; // Array of participant objects
  isActivated: boolean;
  isBlocked: boolean;
  createdAt: Date;
}

export default (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // Extract userId and role from handshake query
    const { userId, role }: UserConnection = socket.handshake
      .query as unknown as UserConnection;

    chatService
      .getChatRoomsByUser(Number(userId), role)
      .then(async (chatRooms) => {
        // Join all rooms associated with the user
        chatRooms.forEach((chat) => {
          socket.join(chat.id.toString());
          console.log(`User ${socket.id} joined room: ${chat.id}`);
        });

        const chats = await chatService.getAllChats(Number(userId));
        
        const result: Record<number, Omit<any, "id">> = {};

        // Store the remaining chat properties using id as key
        chats.forEach((chat) => {
          result[chat.id] = chat;
        });

        console.log(result);

        socket.emit("init", result);
      })
      .catch((error) => {
        console.error("Error fetching chat rooms or joining rooms:", error);
      });

    // Handle sending messages
    socket.on("sendMessage", async (data: Message) => {
      const { chatId, senderId, message } = data;
      try {
        const savedMessage = await chatService.saveMessage(
          chatId,
          senderId,
          message
        );

        // Emit the message to all sockets in the room
        io.to(chatId.toString()).emit("receiveMessage", savedMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Handle disconnects
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
