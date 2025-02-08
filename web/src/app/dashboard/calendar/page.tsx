"use client"
import { useEffect, useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import dynamic from 'next/dynamic';

import MyTUICalendar from "@/components/common/calendar";
import axios from "axios"
import { Pencil } from "lucide-react"

const TimeRange = dynamic(() => import('react-time-range'), { ssr: false });

const splitTimeRange = (start, end, duration) => {
  const slots = [];
  let current = new Date(start);
  const endTime = new Date(end);

  while (current < endTime) {
    const nextSlot = new Date(current.getTime() + duration * 60000);
    if (nextSlot > endTime) break;
    slots.push({
      start: current.toTimeString().slice(0, 5),
      end: nextSlot.toTimeString().slice(0, 5),
    });
    current = nextSlot;
  }
  return slots;
};

export default function CalendarPage() {
  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + 30);

  // const schedules = [
  //   {
  //     id: "1",
  //     calendarId: "1",
  //     title: "Meeting",
  //     body: "<a class='bg-blue-700 p-2 rounded-md text-white' href='http://www.google.com' target='_blank'>Join now</a>",
  //     category: "time",
  //     dueDateClass: "",
  //     start: "2024-10-21T10:30:00",
  //     end: "2024-10-21T11:00:00",
  //   },
  //   {
  //     id: "2",
  //     calendarId: "1",
  //     title: "Conference",
  //     category: "time",
  //     dueDateClass: "",
  //     start: "2024-10-22T09:00:00",
  //     end: "2024-10-22T11:00:00",
  //   },
  // ];
  const userId = (() => localStorage.getItem('userId'))()
  const getAppointments = async () => {
    const res = await axios.get(`http://localhost:4000/appointment/getAppointments/${userId}`)
    // console.log(res.data);
    setUpcomingAppointments(res.data)
    setLoading(false)
  }
  const [doctor, setDoctor] = useState()
  useEffect(() => {
    getAppointments()
  }, [])

  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState("month");
  // Update setSelectedViewType to use the correct function that updates the state
  const setSelectedViewType = (view: string) => setSelectedView(view);
  const [schedules, setSchedules] = useState([])
  function addMinutesAndFormatUTC(utcDateString: string, minutes: number): string {
    const date = new Date(utcDateString); // Convert UTC string to Date object

    // Add the specified minutes
    date.setUTCMinutes(date.getUTCMinutes() + minutes);

    // Format the date components to ensure they are two digits
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutesFormatted = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutesFormatted}:${seconds}`;
  }


  useEffect(() => {
    const newSchedule = upcomingAppointments.map((appointment, index) => {
      return {
        id: appointment.id,
        calendarId: index + 1,
        title: `Appointment with ${appointment.patient.user.fullName}`,
        body: `<a class='bg-blue-700 p-2 rounded-md text-white' href='${appointment.link}' target='_blank'>Join now</a>`,
        category: "time",
        start: addMinutesAndFormatUTC(appointment.appointmentDate, 0),
        end: addMinutesAndFormatUTC(appointment.appointmentDate, 30),
      };
    });
    console.log("new", newSchedule);
    setSchedules(newSchedule)
  }, [upcomingAppointments])

  return (
    <div className="flex flex-1 h-auto pb-28">

      <div className="p-2 md:p-10 rounded-2xl border flex flex-col gap-5 border-neutral-200 bg-white w-full h-full">
        <div className="border p-5 rounded-xl flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Set Your Availability for the Week</h1>
          </div>
          {/* <MyTUICalendar prop={'week'} schedules={schedules} /> */}
          <WeekSchedule />
        </div>
        <div className="border p-5 rounded-xl flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Your Schedule</h1>
            <DropdownMenuCheckboxes
              ViewType={selectedView}
              setSelectedViewType={setSelectedViewType}
            />
          </div>
          <MyTUICalendar prop={selectedView} schedules={schedules} />
        </div>
      </div>
    </div>
  );
}

export function DropdownMenuCheckboxes({ ViewType, setSelectedViewType }: { ViewType: string, setSelectedViewType: (view: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className=" w-64">{ViewType}</Button>
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



const WeekSchedule = () => {
  const [availability, setAvailability] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const [currentDay, setCurrentDay] = useState("");
  const [tempTimes, setTempTimes] = useState([]);
  const [duration, setDuration] = useState(15); // Default duration: 15 minutes

  const handleAddTimeSlot = () => {
    setTempTimes([...tempTimes, { start: "", end: "" }]);
  };

  const handleTimeChange = (index, field, value) => {
    const updatedTimes = [...tempTimes];
    updatedTimes[index][field] = value;
    setTempTimes(updatedTimes);
  };

  const handleRemoveTimeSlot = (index) => {
    const updatedTimes = tempTimes.filter((_, i) => i !== index);
    setTempTimes(updatedTimes);
  };

  const handleSaveAvailability = async (day) => {
    // Check for valid time range
    if (tempTimes.some(({ start, end }) => new Date(`1970-01-01T${start}:00`) >= new Date(`1970-01-01T${end}:00`))) {
      alert("Invalid time slots: start time must be earlier than end time");
      return;
    }

    // Generate time slots from the selected range
    const generatedSlots = tempTimes.flatMap(({ start, end }) => {
      const slots = [];
      let current = new Date(`1970-01-01T${start}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);
      const durationMs = duration * 60 * 1000;

      while (current < endTime) {
        const next = new Date(current.getTime() + durationMs);
        if (next > endTime) break;
        slots.push({
          start: current.toISOString().substring(11, 16),
          end: next.toISOString().substring(11, 16),
        });
        current = next;
      }
      return slots;
    });

    // Save the generated slots to state for the backend
    setAvailability((prev) => ({
      ...prev,
      [day]: generatedSlots,
    }));

    try {
      // Send the generated slots to the backend (example POST request)
      const response = await axios.post("http://localhost:4000/api/availability", {
        [day]: generatedSlots,
      });
      console.log("Generated slots saved successfully:", response.data);
      console.log({
        day,
        slots: generatedSlots,
      });
      
    } catch (error) {
      console.error("Error saving generated slots:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-1">
      {Object.entries(availability).map(([day, times], index) => (
        <div
          key={index}
          className="bg-blue-100 p-4 rounded-lg shadow-md border border-blue-300"
        >
          <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
            <span>{day}</span>
            <Dialog>
              <DialogTrigger asChild>
                <Pencil
                  className="w-4 h-4 ml-2 inline-block cursor-pointer"
                  onClick={() => {
                    setCurrentDay(day);
                    setTempTimes([...availability[day]]);
                  }}
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <h3 className="text-xl font-semibold mb-1">{`Set your availability for ${day}`}</h3>
                <div>
                  <input
                    type="number"
                    placeholder="Enter each slots time in minutes"
                    className="border rounded-md px-4 py-2 w-full mb-4"
                    onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                    defaultValue={duration}
                  />
                </div>
                <div className="space-y-4">
                  {tempTimes.length === 0 && (
                    <p className="font-semibold text-gray-400 text-center text-2xl">No availability set</p>
                  )}
                  {tempTimes.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => handleTimeChange(index, "start", e.target.value)}
                        className="border rounded p-1"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => handleTimeChange(index, "end", e.target.value)}
                        className="border rounded p-1"
                      />
                      <button
                        onClick={() => handleRemoveTimeSlot(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={handleAddTimeSlot}
                    className="bg-blue-500 text-white py-1 px-3 rounded"
                  >
                    Add Time Slot
                  </button>
                  <button
                    onClick={() => handleSaveAvailability(currentDay)}
                    className="bg-green-500 text-white py-1 px-3 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </h2>
          <div className="text-sm space-y-1">
            {times.length === 0 ? (
              <p>No availability set</p>
            ) : (
              // Show only the original selected range
              <p>{times[0].start } - {times[0].end}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
