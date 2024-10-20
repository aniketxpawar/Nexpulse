"use client"
import Calendar from "@/components/common/calendar"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"




export default function CalendarPage() {

  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + 30);


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
  const [selectedView, setSelectedView] = useState("month");
  // Update setSelectedViewType to use the correct function that updates the state
  const setSelectedViewType = (view: string) => setSelectedView(view);
  return <div className="flex flex-1 h-[200svh] pb-28">
    <div className="p-2 md:p-10 rounded-2xl border border-neutral-200 bg-white w-full h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-5">Your Schedule</h1>
        <DropdownMenuCheckboxes ViewType={selectedView} setSelectedViewType={setSelectedViewType} />
      </div>
      <div className="border p-5 rounded-xl">
        <Calendar schedules={schedules} />
      </div>
    </div>
  </div>
}

export function DropdownMenuCheckboxes({ ViewType, setSelectedViewType }: { ViewType: string, setSelectedViewType: (view: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{ViewType}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Schedule Layout</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={ViewType} onValueChange={setSelectedViewType}>
          <DropdownMenuRadioItem value="day">Today's Schedule</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="week">This Week's Schedule</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="month">This Month's Schedule</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
