import SidebarDemo from "@/components/common/sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Dashboard | NexPulse",
    description: "Generated by create next app",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
      <div className="w-[100svw] overflow-y-scroll">
        <SidebarDemo>
        <div className="flex-1 h-auto overflow-y-scroll scroll-smooth">{children}</div>
        </SidebarDemo>
      </div>
  );
}
