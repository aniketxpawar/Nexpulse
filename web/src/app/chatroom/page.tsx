"use client";
import React from "react";
import ChatList from "@/components/chatroom/ChatList";


const ChatroomPage = () => {

  return (
    <div className="w-full md:h-[calc(100vh-3rem)] h-[calc(100vh-3.5rem)] flex p-4 gap-2">
      {/* Left Sidebar with Chatrooms */}
      <ChatList/>

      {/* Right Side Content */}
      <div className="flex flex-col w-[70%] h-full border border-black rounded-xl">
          <div className="flex items-center justify-center h-full text-2xl font-semibold">
            <p>{`Select a chatroom to start chatting`}</p>
          </div>
      </div>
    </div>
  );
};

export default ChatroomPage;
