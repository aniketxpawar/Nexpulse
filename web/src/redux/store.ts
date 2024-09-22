import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice'; // Import your chat slice

export const store = configureStore({
  reducer: {
    chat: chatReducer, // Add your reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
