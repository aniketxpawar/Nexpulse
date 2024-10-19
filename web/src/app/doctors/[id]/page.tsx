"use client"
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IoIosCall } from "react-icons/io";
import { TbPointFilled } from "react-icons/tb";
import { Button } from '@/components/ui/button';
import { MdMessage } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
const doctorProfile = () => {
  const doctor = {
    id: 1,
    name: 'Dr. John Doe',
    image: "https://hinduja-prod-assets.s3.ap-south-1.amazonaws.com/s3fs-public/2022-03/Ashit%20Hegde.png?VersionId=sMzNgniTwhILR5tHFw4YmC7peaecIHJZ",
    city: '',
    state: '',
    speciality: 'Dentist',
    experience: 37,
    rating: 4.5,
    verified: true,
    bio: 'Dr. John Doe is a Cardiologist in New York, NY and has over 37 years of experience in the medical field. He graduated from New York Medical College medical school in 1984.',
    services: ['Cosmetic Dentistry', 'Dental Implants', 'Dental Surgery', 'Dentures', 'General Dentistry', 'Invisalign', 'Orthodontics', 'Pediatric Dentistry', 'Root Canal', 'Teeth Whitening'],
    specialties: ['Cardiology', 'Internal Medicine'],
    awards: ['Patients\' Choice Award (2012)', 'Compassionate Doctor Recognition (2012)', 'Top 10 Doctor - Metro Area (2014)', 'Patients\' Choice 5th Anniversary Award (2017)', 'Patients\' Choice 10th Anniversary Award (2020)'],
    education: ['New York Medical College', 'Residency Hospital', 'Fellowship Hospital']
  }
  const [date, setDate] = useState<Date>()
  const timeSlots = [
    "2022-03-30T09:00:00.000Z",
    "2022-03-30T10:00:00.000Z",
    "2022-03-30T11:00:00.000Z",
    "2022-03-30T12:00:00.000Z"
  ]
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>()
  return (
    <div className='max-w-7xl mx-auto w-full mt-10 min-h-[80svh]'>
      <div className='flex justify-between items-start gap-4'>
        <div className='w-[70svw] flex flex-col gap-4'>
          <div className='flex border rounded-lg px-4 py-3 gap-5'>
            <img src={doctor.image} alt={doctor.name} className='w-48 h-48 object-contain' />
            <div className='w-full'>
              <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold'>{doctor.name}</h1>
                <h1 className='text-white bg-blue-500 text-sm px-2 py-1 rounded'>{doctor.verified && 'verified'}</h1>
              </div>
              <h2>{doctor.speciality}</h2>
              <div className='flex justify-between'>
                <h1>{doctor.experience} years of experience</h1>
                <h1 className='flex items-center gap-1'>{doctor.rating}
                <FaStar className='text-yellow-400' />
                </h1>
              </div>
              <div className='flex gap-3 mt-2 text-sm'>
                <a className='flex items-center justify-center bg-blue-400 text-white gap-2 rounded-lg py-2 w-[180px] hover:cursor-pointer'>
                  <MdMessage />
                  <span>Message</span>
                </a>
                <a className='flex items-center justify-center bg-blue-400 text-white gap-2 rounded-lg py-2 w-[180px] hover:cursor-pointer'>
                  <IoIosCall />
                  <span>123-456-7890</span>
                </a>
              </div>
              <h1 className='text-sm mt-3'>{doctor.bio}</h1>
            </div>


          </div>

          <div className='flex flex-col border rounded-lg px-4 py-3 gap-5'>
            <div className='border-b pb-3 w-full'>
              <h1 className='text-xl font-semibold'>Services</h1>
              <div className='grid grid-cols-3 gap-x-24 mt-3'>
                {
                  doctor.services.map((service) => (
                    <h1 key={service} className='flex items-center text-sm'>
                      <TbPointFilled />
                      {service}
                    </h1>
                  ))
                }
              </div>
            </div>

            <div className='border-b pb-3 w-full'>
              <h1 className='text-xl font-semibold'>Specialities</h1>
              <div className='grid grid-cols-3 gap-x-24 mt-3'>
                {
                  doctor.specialties.map((service) => (
                    <h1 key={service} className='flex items-center text-sm'>
                      <TbPointFilled />
                      {service}
                    </h1>
                  ))
                }
              </div>
            </div>


            <div className='border-b pb-3 w-full'>
              <h1 className='text-xl font-semibold'>Awards</h1>
              <div className='grid grid-cols-1 gap-x-24 mt-3'>
                {
                  doctor.awards.map((service) => (
                    <h1 key={service} className='flex items-center text-sm'>
                      <TbPointFilled />
                      {service}
                    </h1>
                  ))
                }
              </div>
            </div>

            <div className='pb-3 w-full'>
              <h1 className='text-xl font-semibold'>Education</h1>
              <div className='grid grid-cols-1 gap-x-24 mt-3'>
                {
                  doctor.education.map((service) => (
                    <h1 key={service} className='flex items-center text-sm'>
                      <TbPointFilled />
                      {service}
                    </h1>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

        <div className='w-[38svw] border rounded-lg px-4 py-3'>
          <h1 className='text-2xl mb-5 font-bold text-center'>Book an appointment</h1>
          <div className='w-full flex items-center justify-center'>
            <Tabs defaultValue="clinic" className="w-full flex flex-col items-center justify-center">
              <TabsList>
                <TabsTrigger value="clinic">Clinic Appointment</TabsTrigger>
                <TabsTrigger value="online">Online Appointment</TabsTrigger>
              </TabsList>
              <TabsContent value="clinic" className='border w-[25svw] px-10 rounded-lg py-5'>
                <h1>To book an offline appointment, check the available slots below.</h1>

                <div className='flex flex-col items-center justify-center mt-5'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className='mr-2' />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
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

                  {
                    timeSlots.length && <div className='w-full'>
                      <h1 className='mt-3'>Available Time Slots:</h1>
                      <div className='grid grid-cols-3 gap-3 mt-5'>
                        {
                          // @ts-ignore
                          timeSlots.map((slot) => {
                            if (!slot) return null; // Skip if slot is undefined
                            return (
                              <Button key={slot} onClick={() => setSelectedTimeSlot(slot)} className={`hover:bg-blue-400 ${selectedTimeSlot == slot ? "bg-blue-500" : "bg-blue-300"}`}>
                                {format(parseISO(slot), 'hh:mm a')}
                              </Button>
                            )
                          })
                        }
                      </div>
                      <Button className='w-full mt-5'>Book Slot</Button>
                    </div>
                  }
                </div>
              </TabsContent>
              <TabsContent value="online" className='border w-[25svw] px-10 rounded-lg py-5'>
                <h1>To book an online appointment, check the available slots below.</h1>

                <div className='flex flex-col items-center justify-center mt-5'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className='mr-2' />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
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

                  {
                    timeSlots.length && <div className='w-full'>
                      <h1 className='mt-3'>Available Time Slots:</h1>
                      <div className='grid grid-cols-3 gap-3 mt-5'>
                        {
                          // @ts-ignore
                          timeSlots.map((slot) => {
                            if (!slot) return null; // Skip if slot is undefined
                            return (
                              <Button key={slot} onClick={() => setSelectedTimeSlot(slot)} className={`hover:bg-blue-400 ${selectedTimeSlot == slot ? "bg-blue-500" : "bg-blue-300"}`}>
                                {format(parseISO(slot), 'hh:mm a')}
                              </Button>
                            )
                          })
                        }
                      </div>
                      <Button className='w-full mt-5'>Book Slot</Button>
                    </div>
                  }
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default doctorProfile