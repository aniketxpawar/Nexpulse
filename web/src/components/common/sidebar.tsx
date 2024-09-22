"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconCalendarMonth,
  IconHome,
  IconMessage
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // import next hooks for routing
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarDemoProps {
  children?: React.ReactNode;
}

const SidebarDemo: React.FC<SidebarDemoProps> = ({ children }) => {
  const links = [
    {
      label: "Home",
      href: "/dashboard/home",
      icon: (
        <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "My Calendar",
      href: "/dashboard/calendar",
      icon: (
        <IconCalendarMonth className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Chats",
      href: "/dashboard/chat",
      icon: (
        <IconMessage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // To detect current path

  const handleNavigation = (href: string) => {
    router.push(href); // Dynamically change route without reloading
  };

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 flex-1 mx-auto overflow-hidden h-[95svh]" // Ensure this fills most of the screen
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={{
                    ...link,
                    // Highlight active link based on current pathname
                    //@ts-ignore
                    active: pathname === link.href,
                    onClick: () => handleNavigation(link.href),
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            {/* Optional: Add more Sidebar items like a user profile */}
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
};

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        NexPulse
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

export default SidebarDemo;
