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
  const dispatch = useDispatch()

  const handleChatroomClick = (chatroomId: number) => {
    dispatch(chatActions.setActiveRoomId(chatroomId))
    router.push(`/chatroom/${chatroomId}`);
  };
  return (
    <div className="flex w-[30%] h-full flex-col gap-2">
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
                className={`flex items-center gap-4 p-2 border border-black w-full h-20 rounded-md cursor-pointer ${chatroom.id == Number(id) ? "bg-gray-300":""}`}
              >
                <img
                  src={'/ProfilePhoto.png'}
                  alt={`${otherUser.fullName}'s profile picture`}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                
                <div className="w-full">
                  <p className="text-xl font-semibold">{`${localStorage.getItem("role") === "patient" ? "Dr. " : ""}${otherUser.fullName}`}</p>
                  {chatroom.lastMessage && <p className="text-sm font-normal text-gray-900">{`${chatroom.lastMessage.senderId == Number(localStorage.getItem("userId")) ? "You: " : ""}` + 
                  (chatroom.lastMessage.message > 30 ? chatroom.lastMessage.message.slice(0,30) + "..." : chatroom.lastMessage.message)}</p>}
                </div>

                {chatroom.unseenCount > 0 && <p className="rounded-full bg-blue-600 text-white mr-2 px-2">{chatroom.unseenCount}</p>}
                </div>
            );
          })}
      </div>
  )
}

export default ChatList