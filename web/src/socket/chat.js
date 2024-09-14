"use client";
import { io, Socket } from "socket.io-client";
import { createContext, useEffect, useState, ReactNode, useMemo } from "react";

// Define the ChatContext here, including the socket type as context value
const ChatContext = createContext(null);

export default function ChatProvider({ children }) {
  const [socket, setSocket] = useState(null);

  const handleInit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    if (!socket) {
      const role = localStorage.getItem("role");
      const userId = Number(localStorage.getItem("userId"));
      const socketInstance = io("http://localhost:4000", {
        auth: {
          token: localStorage.getItem("token"), // Ensure a valid token is stored
        },
        query: { userId, role },
        rejectUnauthorized: false,
        secure: true,
        forceNew: true,
        autoConnect: false, // Manually connect
      });

      socketInstance.connect();

      socketInstance.on("connect", () => {
        console.log("Socket connected with ID:", socketInstance.id);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Connection error:", error.message);
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      setSocket(socketInstance);

      return () => {
        if (socketInstance) {
          socketInstance.disconnect();
        }
      };
    }
  }, []);

  const eventHandlers = useMemo(() => {
    return {
      init: handleInit,
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      for (const event in eventHandlers) {
        socket.on(event, eventHandlers[event]);
      }

      return () => {
        for (const event in eventHandlers) {
          socket.off(event, eventHandlers[event]);
        }
      };
    }
  }, [eventHandlers]);

  return (
    <ChatContext.Provider value={{ socket }}>{children}</ChatContext.Provider>
  );
}
