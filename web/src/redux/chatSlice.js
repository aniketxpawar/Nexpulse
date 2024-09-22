import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeChatroomId: null,
  messages: [],
  chatrooms: {},
  offset: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatrooms(state, {payload}){
      return {...state,chatrooms:{...state.chatrooms,...payload}}
    },
    setActiveRoomId(state,{payload}){
      return {...state,activeChatroomId:payload}
    },
    setMessages(state, {payload}){
      return {...state,messages:payload}
    },
    setNewMessage(state, {payload}){
      if(state.activeChatroomId && state.activeChatroomId == payload.chatId){
        state.messages = [payload,...state.messages]
      }
      else{
        if(state.chatrooms[payload.chatId]){
          console.log(state.chatrooms[payload.chatId])
          state.chatrooms[payload.chatId].unseenCount =(state.chatrooms[payload.chatId].unseenCount || 0) + 1
        }
      }
      state.chatrooms[payload.chatId].lastMessage = payload
      return state
    },
    setUnseenAsRead(state,{payload}){
      state.chatrooms[payload].unseenCount = 0
    }
  },
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
