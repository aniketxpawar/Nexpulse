// src/middlewares/authMiddleware.ts
import { Socket } from "socket.io";

export const authMiddleware = (socket: Socket, next: (err?: any) => void) => {
  const token = socket.handshake.auth.token;
  if (validateToken(token)) {
    next(); // User is authenticated
  } else {
    next(new Error("Authentication error"));
  }
};

// Example token validation function
const validateToken = (token: string) => {
  // Implement your token validation logic here
  return token === "Token token";
};
