"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ChatList from "@/components/chatroom/ChatList";
import { chatActions } from "@/redux/chatSlice";
import axios from "axios";
import { useChatSocket } from "@/socket/chat";

const convertBinaryToBase64 = (binaryData: Uint8Array) => {
  return `data:image/jpeg;base64,${Buffer.from(binaryData).toString("base64")}`;
};

const ChatroomPage = () => {
  const { id } = useParams(); // Extract chatroomId from the dynamic route
  const socket = useChatSocket();
  const chatrooms: any = useSelector((state: RootState) => state.chat.chatrooms);
  const messages: any = useSelector((state: RootState) => state.chat.messages);
  console.log(messages)
  const dispatch = useDispatch()
  const activeChatRoomId: any = useSelector((state: RootState) => state.chat.activeChatroomId);
  const userId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");
  const [activeChatRoom,setActiveChatroom] = useState(null)
  const [otherUser,setOtherUser] = useState(null)

  const [messageInput,setMessageInput] = useState("")

  const samplemessages = [{
    senderId: 2,
    message: "Hi"
  },{
    senderId: 1,
    message: "Hello"
  },{
    senderId: 2,
    message: "I wanted a appointmnet today"
  },{
    senderId: 1,
    message: "Which time would you like, morning or evening?"
  },{
    senderId: 2,
    message: "Evening"
  },{
    senderId: 1,
    message: "We have slots at 7pm and 8:30pm"
  },{
    senderId: 2,
    message: "8:30pm sounds good"
  },]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      chatId: Number(activeChatRoomId),
      senderId: Number(userId),
      message: messageInput,
    };

    // Emit a sendMessage event
    socket?.emit("sendMessage", payload);

    setMessageInput("");
  }

  const handleFetchMessages = async (chatId: number) => {
    const response = await axios.get('http://localhost:4000/chat/getMessagesByChatId/'+chatId)
    console.log(response)
    if(response?.status == 200){
      dispatch(chatActions.setMessages(response.data.length > 0 ? response.data : samplemessages.reverse()))
    }
  }

  useEffect(() => {
    if(id != activeChatRoomId) {
      dispatch(chatActions.setActiveRoomId(id))
      return
    }
    if(activeChatRoomId && Object.keys(chatrooms)?.length > 0){
      setActiveChatroom(chatrooms[activeChatRoomId])
      console.log(chatrooms[activeChatRoomId].participants.find((user:any) => user.id != userId))
      setOtherUser(chatrooms[activeChatRoomId].participants.find((user:any) => user.id != userId))
      handleFetchMessages(activeChatRoomId)
    }
  },[id,activeChatRoomId,chatrooms])

  return (
    <div className="w-full md:h-[calc(100vh-3rem)] h-[calc(100vh-3.5rem)] flex p-4 gap-2">
      {/* Left Sidebar with Chatrooms */}
      <ChatList/>

      {/* Right Side Content */}
      <div className="flex flex-col justify-between w-[70%] h-full border border-black rounded-xl">
        {activeChatRoom ? (
          <>
          <div className="">
            <div className="flex gap-4 border-b border-black p-4">
            <img
                  src={"/ProfilePhoto.png"}
                  alt={`${otherUser.fullName}'s profile picture`}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div className="mr-4">

            <h2 className="text-2xl font-semibold">
              {`${role === "patient" ? "Dr. " : ""}${activeChatRoom.participants.find((p: any) => p.user.id !== userId)?.user.fullName}`}
            </h2>
            {otherUser.user.role === "doctor" && otherUser.user.doctor && (
                  <p>{otherUser.user.doctor.specialization}</p>
                )}
                </div>
              </div>
          </div>

          <div className="h-full flex flex-col-reverse gap-4 w-full p-2">
          {messages?.map(({message, senderId}) => {
            return (
            <div className={`${senderId == userId ? "bg-gray-300" : "bg-blue-600"} 
            ${senderId == userId ? "text-black" : "text-white"} p-2 px-4 rounded-full w-fit ${senderId == userId ? "ml-auto" : "mr-auto"}`}>
              {message}
            </div>)
          })}
          </div>

          <div className="h-12 flex m-2">
            <form className="flex w-full gap-2" onSubmit={handleSubmit}>

            <input 
              placeholder="Enter the message" 
              name="messageInput"
              onChange={(e) => {e.preventDefault(); setMessageInput(e.target.value)}} 
              className="border border-black w-full rounded-md px-2" />
            <button type="submit" className="h-12 w-20 bg-blue-600 rounded-md text-white text-lg font-semibold">Send</button>
            </form>
          </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-2xl font-semibold">
            <p>{`Select a chatroom to start chatting`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatroomPage;
