"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ChatList from "@/components/chatroom/ChatList";
import { chatActions } from "@/redux/chatSlice";
import axios from "axios";
import { useChatSocket } from "@/socket/chat";
import { MdSend } from "react-icons/md";

const ChatroomPage = () => {
  const { id } = useParams(); // Extract chatroomId from the dynamic route
  const socket = useChatSocket();
  const chatrooms: any = useSelector((state: RootState) => state.chat.chatrooms);
  const messages: any = useSelector((state: RootState) => state.chat.messages);
  const dispatch = useDispatch();
  const activeChatRoomId: any = useSelector(
    (state: RootState) => state.chat.activeChatroomId
  );

  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [activeChatRoom, setActiveChatroom] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(Number(localStorage.getItem("userId")));
      setRole(localStorage.getItem("role"));
    }
  }, []);

  // const samplemessages = [
  //   { senderId: 2, message: "Hi" },
  //   { senderId: 1, message: "Hello" },
  //   { senderId: 2, message: "I wanted a appointment today" },
  //   { senderId: 1, message: "Which time would you like, morning or evening?" },
  //   { senderId: 2, message: "Evening" },
  //   { senderId: 1, message: "We have slots at 7pm and 8:30pm" },
  //   { senderId: 2, message: "8:30pm sounds good" },
  // ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput || !userId) return;

    const payload = {
      chatId: Number(activeChatRoomId),
      senderId: userId,
      message: messageInput,
    };

    socket?.emit("sendMessage", payload);
    setMessageInput("");
  };

  const handleFetchMessages = async (chatId: number) => {
    const response = await axios.get(
      "http://localhost:4000/chat/getMessagesByChatId/" + chatId
    );
    if (response?.status === 200) {
      dispatch(
        chatActions.setMessages(
          response.data.messages.length > 0
            ? response.data.messages
            : []
        )
      );
    }
  };

  useEffect(() => {
    if (id !== activeChatRoomId) {
      dispatch(chatActions.setActiveRoomId(id));
      return;
    }
    if (activeChatRoomId && Object.keys(chatrooms)?.length > 0 && userId) {
      setActiveChatroom(chatrooms[activeChatRoomId]);
      const foundUser = chatrooms[activeChatRoomId].participants.find(
        (user: any) => user.userId !== userId
      );
      dispatch(chatActions.setUnseenAsRead(activeChatRoomId))
      setOtherUser(foundUser);
      handleFetchMessages(activeChatRoomId);
    }
  }, [id, activeChatRoomId, chatrooms, userId]);

  // useEffect(() => console.log(activeChatRoom), [activeChatRoom]);

  return (
    <div className="w-full md:h-[calc(100vh-3rem)] h-[calc(100vh-3.5rem)] flex p-2">
      {/* Left Sidebar with Chatrooms */}
      <ChatList />

      {/* Right Side Content */}
      <div className="flex flex-col justify-between w-[70%] h-full rounded-xl">
        {activeChatRoom ? (
          <>
            <div className="">
              <div className="flex gap-4 border-b p-4">
                <img
                  src={"/ProfilePhoto.png"}
                  alt={`${otherUser?.user.fullName}'s profile picture`}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div className="mr-4">
                  <h2 className="text-2xl font-semibold">
                    {`${role === "patient" ? "Dr. " : ""}${
                      otherUser?.user.fullName
                    }`}
                  </h2>
                  {otherUser?.user.role === "doctor" &&
                    otherUser?.user.doctor && (
                      <p>{otherUser.user.doctor.specialization}</p>
                    )}
                </div>
              </div>
            </div>

            <div className="h-full flex flex-col-reverse gap-1.5 w-full p-2 overflow-scroll no-scrollbar bg-gray-50">
              {/* @ts-ignore */}
              {messages?.map(({ message, senderId }, index) => {
                return (
                  <div
                    key={index}
                    className={`${
                      senderId == userId
                        ? "bg-gray-300 text-black"
                        : "bg-blue-600 text-white"
                    } p-2 px-4 rounded-full w-fit  ${
                      senderId == userId ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    {message}
                  </div>
                );
              })}
            </div>

            <div className="h-12 flex m-2">
              <form className="flex w-full gap-2" onSubmit={handleSubmit}>
                <input
                  placeholder="Enter message"
                  name="messageInput"
                  value={messageInput}
                  onChange={(e) => {
                    e.preventDefault();
                    setMessageInput(e.target.value);
                  }}
                  className="border w-full rounded-full px-4"
                />
                <button
                  type="submit"
                  className=" bg-blue-600 px-2 rounded-full text-white text-lg font-semibold"
                >
                  <MdSend size={24} />
                </button>
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
