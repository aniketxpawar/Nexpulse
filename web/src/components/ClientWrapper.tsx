"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import ChatProvider from "@/socket/chat";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ChatProvider>{children}</ChatProvider>
    </Provider>
  );
}
