"use client"

import { chatActions } from "@/redux/chatSlice";
import { RootState } from "@/redux/store";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

const convertBinaryToBase64 = (binaryData: Uint8Array) => {
    return `data:image/jpeg;base64,${Buffer.from(binaryData).toString("base64")}`;
  };

const ChatList = () => {
    const chatrooms: any = useSelector((state: RootState) => state.chat.chatrooms);
  // const userId = Number(localStorage.getItem("userId"));
  // const role = localStorage.getItem("role");
  const router = useRouter();
  const {id} = useParams()
  const role = (() => localStorage.getItem("role"))();
  const dispatch = useDispatch()

  const handleChatroomClick = (chatroomId: number) => {
    dispatch(chatActions.setActiveRoomId(chatroomId))
    role === 'doctor' ? router.push(`/dashboard/chat/${chatroomId}`) : router.push(`/chatroom/${chatroomId}`)
  };
  return (
    <div className="flex w-[30%] h-full flex-col gap-2 border-r px-2">
        {chatrooms &&
          Object.keys(chatrooms).map((key) => {
            const chatroom = chatrooms[Number(key)];
            console.log(chatroom)
            const otherUser =
              chatroom.participants[0].user.id === Number(localStorage.getItem("userId"))
                ? chatroom.participants[1].user
                : chatroom.participants[0].user;

            return (
              <div
                key={chatroom.id}
                onClick={() => handleChatroomClick(chatroom.id)}
                className={`flex items-center gap-2 p-2 w-full h-20 rounded-md cursor-pointer ${chatroom.id == Number(id) ? "bg-gray-200":""}`}
              >
                <img
                  src={'/ProfilePhoto.png'}
                  alt={`${otherUser.fullName}'s profile picture`}
                  style={{
                    width: "47px",
                    height: "47px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                
                <div className="w-full">
                  <p className="text-lg font-semibold">{`${localStorage.getItem("role") === "patient" ? "Dr. " : ""}${otherUser.fullName}`}</p>
                  {chatroom.lastMessage && <p className="text-xs font-normal text-gray-900">{`${chatroom.lastMessage.senderId == Number(localStorage.getItem("userId")) ? "You: " : ""}` + 
                  (chatroom.lastMessage.message > 30 ? chatroom.lastMessage.message.slice(0,30) + "..." : chatroom.lastMessage.message)}</p>}
                </div>

                {chatroom.unseenCount > 0 && <p className="rounded-full text-sm bg-blue-600 text-white mr-2 px-2">{chatroom.unseenCount}</p>}
                </div>
            );
          })}
      </div>
  )
}

export default ChatList