"use client"
import { useEffect } from "react";
import Calendar from "tui-calendar"; // ES6
import "tui-calendar/dist/tui-calendar.css"; // Import default styles
import "./calendar.css";

interface Schedule {
  id: string;
  calendarId: string;
  title: string;
  body?: string; // Optional field for custom popup content
  category: string;
  dueDateClass?: string;
  start: string;
  end: string;
}

interface MyTUICalendarProps {
  schedules: Schedule[];
}

const MyTUICalendar: React.FC<MyTUICalendarProps> = ({ schedules }) => {
  useEffect(() => {
    const calendar = new Calendar("#calendar", {
      defaultView: "week", // or 'month', 'day'
      taskView: false, // Hide the task view
      scheduleView: true, // Show the schedule view
      useDetailPopup: true, // Popup for details
      template: {
        time: function (schedule) {
          console.log(schedule);
          
          return <span>{schedule.title}</span>;
        },
      },
      theme: {
        "common.border": "1px solid #ddd",
        "common.backgroundColor": "#fff",
        "week.timegridLeftBackgroundColor": "#fafafa",
        "week.today.backgroundColor": "#e2f3ff",
        "week.weekend.backgroundColor": "#fafafa",
      },
    });

    // Populate calendar with existing schedules
    calendar.createSchedules(schedules);

    return () => calendar.destroy();
  }, [schedules]);

  return <div id="calendar" className="" />;
};

export default MyTUICalendar;