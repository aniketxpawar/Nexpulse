import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeChatroomId: null,
  chatrooms: {},
  offset: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;
