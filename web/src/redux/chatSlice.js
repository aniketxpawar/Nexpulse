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
      console.log(payload)
      return {...state,chatrooms:{...state.chatrooms,...payload}}
    },
    setActiveRoomId(state,{payload}){
      return {...state,activeChatroomId:payload}
    },
    setMessages(state, {payload}){
      return {...state,messages:payload}
    },
    setNewMessage(state, {payload}){
      return {...state,messages:[payload,...state.messages]}
    }
  },
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
