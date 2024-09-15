"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ChatList from "@/components/chatroom/ChatList";
import { chatActions } from "@/redux/chatSlice";

const convertBinaryToBase64 = (binaryData: Uint8Array) => {
  return `data:image/jpeg;base64,${Buffer.from(binaryData).toString("base64")}`;
};

const ChatroomPage = () => {
  const { id } = useParams(); // Extract chatroomId from the dynamic route
  const chatrooms: any = useSelector((state: RootState) => state.chat.chatrooms);
  const dispatch = useDispatch()
  const activeChatRoomId: any = useSelector((state: RootState) => state.chat.activeChatroomId);
  const userId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");
  const [activeChatRoom,setActiveChatroom] = useState(null)
  const [otherUser,setOtherUser] = useState(null)

  useEffect(() => {
    if(id != activeChatRoomId) {
      dispatch(chatActions.setActiveRoomId(id))
      return
    }
    if(activeChatRoomId && Object.keys(chatrooms)?.length > 0){
      setActiveChatroom(chatrooms[activeChatRoomId])
      console.log(chatrooms[activeChatRoomId].participants.find((user:any) => user.id != userId))
      setOtherUser(chatrooms[activeChatRoomId].participants.find((user:any) => user.id != userId))
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

          <div className="h-full"></div>

          <div className="h-12 flex m-2">
            <input placeholder="Enter the message" name="messageInput" className="border border-black w-full rounded-md" />
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
