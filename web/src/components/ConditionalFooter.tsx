"use client"; // Ensure this is a client component

import { usePathname } from "next/navigation";
import Footer from "@/components/common/footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/chatroom")) {
    return null;
  }

  return <Footer />;
}
