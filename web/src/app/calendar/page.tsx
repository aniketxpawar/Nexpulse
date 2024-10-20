"use client";
import MyTUICalendar from "@/components/common/MyCalendar";
import MyCalendar from "@/components/common/MyCalendar";
import React from "react";

const HomePage: React.FC = () => {
  const schedules = [
    {
      id: "1",
      calendarId: "1",
      title: "Meeting",
      body: "<a class='bg-blue-700 p-2 rounded-md text-white' href='http://www.google.com' target='_blank'>Join now</a>",
      category: "time",
      dueDateClass: "",
      start: "2024-10-21T10:30:00",
      end: "2024-10-21T11:00:00",
    },
    {
      id: "2",
      calendarId: "1",
      title: "Conference",
      category: "time",
      dueDateClass: "",
      start: "2024-10-22T09:00:00",
      end: "2024-10-22T11:00:00",
    },
  ];

  return (
    <div className="">
      <MyTUICalendar schedules={schedules} />
    </div>
  );
};

export default HomePage;
