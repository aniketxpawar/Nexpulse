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
import moment from 'moment';

import MyTUICalendar from "@/components/common/calendar";
import axios from "axios"
import { Pencil } from "lucide-react"

export default function CalendarPage() {
  const currentDate = moment().add(30, 'minutes');

  const userId = (() => localStorage.getItem('userId'))()
  const getAppointments = async () => {
    const res = await axios.get(`http://localhost:4000/appointment/getAppointments/${userId}`)
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
  
  // Updated to use moment instead of manual date manipulation
  function formatAppointmentTime(dateString: string, minutesToAdd: number): string {
    return moment(dateString).add(minutesToAdd, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
  }

  useEffect(() => {
    const newSchedule = upcomingAppointments.map((appointment, index) => {
      return {
        id: appointment.id,
        calendarId: index + 1,
        title: `Appointment with ${appointment.patient.user.fullName}`,
        body: `<a class='bg-blue-700 p-2 rounded-md text-white' href='${appointment.link}' target='_blank'>Join now</a>`,
        category: "time",
        start: formatAppointmentTime(appointment.appointmentDate, 0),
        end: formatAppointmentTime(appointment.appointmentDate, 30),
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
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const [availability, setAvailability] = useState(
    days.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.post("http://localhost:4000/appointment/get-slots", {
          doctorId: localStorage.getItem("userId"),
        });

        const fetchedSlots = response.data;
        console.log("Fetched availability slots:", fetchedSlots);

        // Convert slots to local time and ensure all days are present
        const localSchedule = convertToLocalTime(fetchedSlots);
        console.log("Converted to local time:", localSchedule);

        // Merge fetched slots with existing days structure
        const completeSchedule = days.reduce((acc, day) => ({
          ...acc,
          [day]: localSchedule[day] || []
        }), {});

        setAvailability(completeSchedule);
      } catch (error) {
        console.error("Error fetching availability slots:", error);
      }
    };

    fetchAvailability();
  }, []);

  // Updated to use moment for time conversions
  const convertToLocalTime = (schedule) => {
    const convertedSchedule = {};

    for (const [day, slots] of Object.entries(schedule)) {
      convertedSchedule[day] = slots.map(slot => {
        if (typeof slot === "string") {
          return moment(slot).format('LLL');
        } else if (typeof slot === "object" && slot.start && slot.end) {
          return {
            start: moment(slot.start).format('HH:mm'),
            end: moment(slot.end).format('HH:mm'),
          };
        }
        return slot;
      });
    }

    return convertedSchedule;
  };

  const [currentDay, setCurrentDay] = useState("");
  const [tempTimes, setTempTimes] = useState([]);
  const [duration, setDuration] = useState(30);

  const handleAddTimeSlot = () => {
    setTempTimes([...tempTimes, { start: "", end: "" }]);
  };

  const handleTimeChange = (index, field, value) => {
    const updatedTimes = [...tempTimes];
    updatedTimes[index][field] = value;
    setTempTimes(updatedTimes);
  };

  const handleRemoveTimeSlot = (index) => {
    setTempTimes(tempTimes.filter((_, i) => i !== index));
  };

  // Updated to use moment for time handling and slot generation
  const handleSaveAvailability = async (day) => {
    if (tempTimes.some(({ start, end }) => 
      moment(start, 'HH:mm').isSameOrAfter(moment(end, 'HH:mm'))
    )) {
      alert("Invalid time slots: start time must be earlier than end time");
      return;
    }

    // Generate slots using moment
    const generatedSlots = tempTimes.flatMap(({ start, end }) => 
      generateTimeSlots(start, end, day)
    );

    setAvailability((prev) => ({
      ...prev,
      [day]: convertToLocalTime({ [day]: generatedSlots })[day],
    }));

    try {
      await axios.post("http://localhost:4000/appointment/availability", {
        doctorId: localStorage.getItem("userId"),
        availability: { [day]: generatedSlots },
      });
      console.log("Generated slots saved successfully:", generatedSlots);
    } catch (error) {
      console.error("Error saving generated slots:", error);
    }
  };

  // New function using moment as per your example
  function generateTimeSlots(
    start: string,
    end: string,
    day: string
  ): { start: string; end: string }[] {
    // Find the next occurrence of the given weekday
    let referenceDate = moment().day(day);
    if (moment().isAfter(referenceDate, "day")) {
      referenceDate = referenceDate.add(7, "days"); // Move to next week's day if needed
    }
    
    // Set start and end times on that day
    const startTime = referenceDate.clone().set({
      hour: parseInt(start.split(":")[0]),
      minute: parseInt(start.split(":")[1]),
      second: 0,
      millisecond: 0,
    });
    
    const endTime = referenceDate.clone().set({
      hour: parseInt(end.split(":")[0]),
      minute: parseInt(end.split(":")[1]),
      second: 0,
      millisecond: 0,
    });
    
    // Generate slots
    const slots: { start: string; end: string }[] = [];
    let slot = startTime.clone();
    
    while (slot.isBefore(endTime)) {
      let slotEnd = slot.clone().add(duration, "minutes"); // Create slots of specified duration
      if (slotEnd.isAfter(endTime)) break;
      
      slots.push({ 
        start: slot.toISOString(), 
        end: slotEnd.toISOString() 
      });
      
      slot = slotEnd;
    }
    
    return slots;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-1">
      {days.map((day, index) => (
        <div key={index} className="bg-blue-100 p-4 rounded-lg shadow-md border border-blue-300">
          <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
            <span>{day}</span>
            <Dialog>
              <DialogTrigger asChild>
                <Pencil
                  className="w-4 h-4 ml-2 inline-block cursor-pointer"
                  onClick={() => {
                    setCurrentDay(day);
                    setTempTimes(availability[day]?.length ? [...availability[day]] : []);
                  }}
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <h3 className="text-xl font-semibold mb-1">{`Set your availability for ${day}`}</h3>
                <div className="space-y-4">
                  {tempTimes.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No time slots added yet</p>
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
                      <button onClick={() => handleRemoveTimeSlot(index)} className="text-red-500 text-sm">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button onClick={handleAddTimeSlot} className="bg-blue-500 text-white py-1 px-3 rounded">
                    Add Time Slot
                  </button>
                  <button onClick={() => handleSaveAvailability(currentDay)} className="bg-green-500 text-white py-1 px-3 rounded">
                    Save Changes
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </h2>
          <div className="text-sm space-y-1">
            {(!availability[day] || availability[day].length === 0) ? (
              <p className="text-gray-500">No slots available</p>
            ) : (
              availability[day].map((slot, index) => (
                <p key={index} className="text-gray-700">
                  {slot.start} - {slot.end}
                </p>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};