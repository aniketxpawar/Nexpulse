"use client";
import React, { useEffect } from "react";
import ChatList from "@/components/chatroom/ChatList";
import { useDispatch } from "react-redux";
import { chatActions } from "@/redux/chatSlice";


const ChatroomPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(chatActions.setActiveRoomId(null))
  },[])

  return (
    <div className="w-full md:h-[calc(100vh-3rem)] h-[calc(100vh-3.5rem)] flex">
      {/* Left Sidebar with Chatrooms */}
      <ChatList/>

      {/* Right Side Content */}
      <div className="flex flex-col w-[70%] h-full bg-gray-50 rounded-xl">
          <div className="flex items-center justify-center h-full text-2xl font-semibold">
            <p>{`Select a chatroom to start chatting`}</p>
          </div>
      </div>
    </div>
  );
};

export default ChatroomPage;
