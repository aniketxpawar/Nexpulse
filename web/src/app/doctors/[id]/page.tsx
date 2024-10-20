"use client"
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IoIosCall } from "react-icons/io";
import { TbPointFilled } from "react-icons/tb";
import { Button } from '@/components/ui/button';
import { MdMessage } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { cardio } from 'ldrs'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
cardio.register()

// Default values shown

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CalendarIcon } from 'lucide-react';
import { addMinutes, format, parseISO, set } from 'date-fns';
import { useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { doctorPic } from '@/assets/defaultProfiles';
const doctorProfile = () => {
  const [loading, setLoading] = useState(true)
  const id = useParams().id
  console.log(id);

  const [doctor, setDoctor] = useState(null);

  const fetchAvailableSlots = async () => {
    const res = await axios.post('http://localhost:4000/appointment/get-slots', {
      doctorId: id,
      date: date
    })
    console.log(res);
    setTimeSlots(res.data.availableSlots)
    setLoading(false)
  }
  const [chatId, setChatId] = useState(null)
  const fetchDoctorDetails = async () => {
    const res = await axios.post('http://localhost:4000/user/get-doctor', {
      doctorId: id,
      userId: localStorage.getItem('userId')
    })
    console.log(res);
    setDoctor(res.data.doctor)
    setChatId(res.data.chatId)
  }
  useEffect(() => {
    fetchDoctorDetails()
    setDate(new Date())
  }, [])

  const [date, setDate] = useState<Date>()

  useEffect(() => {
    if (date) {
      fetchAvailableSlots()
    }
  }, [date])

  const createCombinedDate = ({date, selectedTimeSlot}) => {
    // Get year, month, and day from the date state
    const year = date.getFullYear();
    const month = date.getMonth(); // Note: month is 0-indexed (0 = January)
    const day = date.getDate();

    // Get hours and minutes from the selectedTimeSlot
    const hours = selectedTimeSlot.getHours();
    const minutes = selectedTimeSlot.getMinutes();

    // Create a new Date object combining both date and time
    const combinedDate = new Date(year, month, day, hours, minutes);

    // Log the combined date
    return combinedDate;
  };

  const allotTimeSlot = async () => {
    if (!selectedTimeSlot) {
      toast.error('Please select a time slot')
      return
    }
    const res = await axios.post('http://localhost:4000/appointment/createAppointment', {
      userId: localStorage.getItem('userId'),
      doctorId: id,
      patientId: localStorage.getItem('userId'),
      appointmentDate: selectedTimeSlot,
      type: type,
      healthConcern: healthConcern
    })
    console.log(res);
  }

  const [booking, setBooking] = useState(false)
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>()
  const [type, setType] = useState('');
  const [healthConcern, setHealthConcern] = useState('')

  const handleMessage = async() => {
    if(chatId) {
      window.location.href = `/chatroom/${chatId}`
    }else{
      try{
        const res = await axios.post('http://localhost:4000/chat/create-chat', {
          participants: [Number(localStorage.getItem('userId')), Number(doctor.userId)]
        })
        console.log(res);
        
        if(res?.data?.chat?.id){
          window.location.href = `/chatroom/${res?.data?.chat?.id}`
        }
      }catch(err){
        console.log(err)
      }
    }
  }
  return (
    <div className="max-w-7xl mx-auto w-full mt-10 min-h-[80svh]">
      {loading ? (
        <div className="flex items-center justify-center w-full h-[80svh]">
          <l-cardio size="150" stroke="10" speed="1" color="skyblue"></l-cardio>
        </div>
      ) : (
        <div className="flex justify-between items-start gap-4">
          <div className="w-[70svw] flex flex-col gap-4">
            <div className="flex border rounded-lg px-4 py-3 gap-5">
              <img
                src={
                  doctor?.user.profilePic ? doctor?.user.profilePic : doctorPic
                }
                alt={doctor?.user.fullName}
                className="w-52 h-52 object-contain"
              />
              <div className="w-full">
                <div className="flex items-center justify-between">
                  {/* @ts-ignore */}
                  <h1 className="text-3xl font-bold">
                    Dr. {doctor?.user.fullName}
                  </h1>
                  {/* @ts-ignore */}
                  {doctor?.verfied && (
                    <h1 className="text-white bg-blue-500 text-sm px-2 py-1 rounded">
                      verified
                    </h1>
                  )}
                </div>
                <h2>{doctor?.specialization}</h2>
                <div className="flex justify-between">
                  <h1>{doctor?.experience} years of experience</h1>
                  {/* <h1 className='flex items-center gap-1'>{doctor?.rating}
                <FaStar className='text-yellow-400' />
                </h1> */}
                </div>
                <h1>Consultation Charge: Rs.{doctor?.consultationCharge}</h1>
                <div className="flex gap-3 mt-2 text-sm">
                  <a onClick={handleMessage} className="flex items-center justify-center bg-blue-400 text-white gap-2 rounded-lg py-2 w-[180px] hover:cursor-pointer">
                    <MdMessage />
                    <span>Message</span>
                  </a>
                  <a className="flex items-center justify-center bg-blue-400 text-white gap-2 rounded-lg py-2 w-[180px] hover:cursor-pointer">
                    <IoIosCall />
                    <span>{doctor?.user.phone}</span>
                  </a>
                </div>
                <h1 className="text-sm mt-3">{doctor?.profile}</h1>
              </div>
            </div>

            <div className="flex flex-col border rounded-lg px-4 py-3 gap-5">
              <div className="border-b pb-3 w-full">
                <h1 className="text-xl font-semibold">Services</h1>
                {/* <div className='grid grid-cols-3 gap-x-24 mt-3'>
                {
                  doctor?.services.map((service) => (
                    <h1 key={service} className='flex items-center text-sm'>
                      <TbPointFilled />
                      {service}
                    </h1>
                  ))
                }
              </div> */}
              </div>

              <div className="border-b pb-3 w-full">
                <h1 className="text-xl font-semibold">Specialities</h1>
                {/* <div className='grid grid-cols-3 gap-x-24 mt-3'>
                {
                  doctor?.specialties.map((service) => (
                    <h1 key={service} className='flex items-center text-sm'>
                      <TbPointFilled />
                      {service}
                    </h1>
                  ))
                }
              </div> */}
              </div>

              <div className="border-b pb-3 w-full">
                <h1 className="text-xl font-semibold">Awards</h1>
                {/* <div className='grid grid-cols-1 gap-x-24 mt-3'>
                {
                  doctor?.awards.map((service) => (
                    <h1 key={service} className='flex items-center text-sm'>
                      <TbPointFilled />
                      {service}
                    </h1>
                  ))
                }
              </div> */}
              </div>

              <div className="pb-3 w-full">
                <h1 className="text-xl font-semibold">Education</h1>
                {/* <div className='grid grid-cols-1 gap-x-24 mt-3'>
                {
                  doctor?.education.map((service) => (
                    <h1 key={service} className='flex items-center text-sm'>
                      <TbPointFilled />
                      {service}
                    </h1>
                  ))
                }
              </div> */}
              </div>
            </div>
          </div>

          <div className="w-[38svw] border rounded-lg px-4 py-3">
            <h1 className="text-2xl mb-5 font-bold text-center">
              Book an appointment
            </h1>
            <div className="w-full flex items-center justify-center">
              <Tabs
                defaultValue="clinic"
                className="w-full flex flex-col items-center justify-center"
              >
                <TabsList>
                  <TabsTrigger value="clinic">Clinic Appointment</TabsTrigger>
                  <TabsTrigger value="online">Online Appointment</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="clinic"
                  className="border w-[25svw] px-10 rounded-lg py-5"
                >
                  <h1>
                    To book an offline appointment, check the available slots
                    below.
                  </h1>

                  <div className="flex flex-col items-center justify-center mt-5">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {timeSlots.length > 0 ? (
                      <div className="w-full">
                        <h1 className="mt-3">Available Time Slots:</h1>
                        <div className="grid grid-cols-3 gap-3 mt-5">
                          {
                            // @ts-ignore
                            timeSlots.map((slot) => {
                              if (!slot) return null; // Skip if slot is undefined
                              const date = new Date(slot);

                              // Get hours and minutes
                              let hours = date.getUTCHours();
                              const minutes = date
                                .getUTCMinutes()
                                .toString()
                                .padStart(2, "0");

                              // Determine AM or PM
                              const ampm = hours >= 12 ? "PM" : "AM";

                              // Convert 24-hour format to 12-hour format
                              hours = hours % 12 || 12; // Convert 0 to 12 for midnight case

                              // Format the time as "h:mm AM/PM"
                              const timeWithAMPM = `${hours}:${minutes} ${ampm}`;

                              return (
                                <Button
                                  key={slot}
                                  onClick={() => {
                                    setSelectedTimeSlot(slot);
                                  }}
                                  className={`hover:bg-blue-500 ${
                                    selectedTimeSlot == slot
                                      ? "bg-blue-700"
                                      : "bg-blue-400"
                                  }`}
                                >
                                  {timeWithAMPM}
                                </Button>
                              );
                            })
                          }
                        </div>

                        <LabelInputContainer className="mt-5">
                          <Label htmlFor="healthConcerns">
                            Health Concerns
                          </Label>
                          <Input
                            type="text"
                            name="healthConcerns"
                            id="healthConcerns"
                            placeholder="Enter Your Health Concerns"
                            onChange={(e) => setHealthConcern(e.target.value)}
                          />
                        </LabelInputContainer>
                        <div></div>
                        <Button
                          className="w-full mt-5"
                          disabled={booking}
                          onClick={() => {
                            setBooking(true);
                            setType("online");
                            allotTimeSlot();
                          }}
                        >
                          {booking ? "Booking slot" : "Book Slot"}
                        </Button>
                      </div>
                    ) : (
                      <h1 className="mt-5 text-red-500">
                        No slots available for this date
                      </h1>
                    )}
                  </div>
                </TabsContent>
                <TabsContent
                  value="online"
                  className="border w-[25svw] px-10 rounded-lg py-5"
                >
                  <h1>
                    To book an online appointment, check the available slots
                    below.
                  </h1>

                  <div className="flex flex-col items-center justify-center mt-5">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2" />
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {timeSlots.length > 0 ? (
                      <div className="w-full">
                        <h1 className="mt-3">Available Time Slots:</h1>
                        <div className="grid grid-cols-3 gap-3 mt-5">
                          {
                            // @ts-ignore
                            timeSlots.map((slot) => {
                              if (!slot) return null; // Skip if slot is undefined
                              const date = new Date(slot);

                                // Get hours and minutes
                                let hours = date.getUTCHours();
                                const minutes = date
                                  .getUTCMinutes()
                                  .toString()
                                  .padStart(2, "0");

                                // Determine AM or PM
                                const ampm = hours >= 12 ? "PM" : "AM";

                                // Convert 24-hour format to 12-hour format
                                hours = hours % 12 || 12; // Convert 0 to 12 for midnight case

                                // Format the time as "h:mm AM/PM"
                                const timeWithAMPM = `${hours}:${minutes} ${ampm}`;

                              return (
                                <Button
                                  key={slot}
                                  onClick={() => {
                                    setSelectedTimeSlot(slot);
                                  }}
                                  className={`hover:bg-blue-500 ${
                                    selectedTimeSlot == slot
                                      ? "bg-blue-700"
                                      : "bg-blue-400"
                                  }`}
                                >
                                  {timeWithAMPM}
                                </Button>
                              );
                            })
                          }
                        </div>

                        <LabelInputContainer className="mt-5">
                          <Label htmlFor="healthConcerns">
                            Health Concerns
                          </Label>
                          <Input
                            type="text"
                            name="healthConcerns"
                            id="healthConcerns"
                            placeholder="Enter Your Health Concerns"
                            onChange={(e) => setHealthConcern(e.target.value)}
                          />
                        </LabelInputContainer>
                        <div></div>
                        <Button
                          className="w-full mt-5"
                          disabled={booking}
                          onClick={() => {
                            setBooking(true);
                            setType("online");
                            allotTimeSlot();
                          }}
                        >
                          {booking ? "Booking slot" : "Book Slot"}
                        </Button>
                      </div>
                    ) : (
                      <h1 className="mt-5 text-red-500">
                        No slots available for this date
                      </h1>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default doctorProfile