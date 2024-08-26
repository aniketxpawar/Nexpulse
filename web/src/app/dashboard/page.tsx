"use client"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"


  export default function DashboardPage() {
    return <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-2xl border border-neutral-200 bg-white grid grid-cols-3 w-full h-full">
        <div className="col-span-2">
          <GreetCard />
        </div>
        <div className="col-span-1 h-[40vh] w-[50vw] flex"> {/* Adjusted height here */}
          <Calendar />
        </div>
      </div>
    </div>
  }
  
  function GreetCard() {
    return <div className="bg-blue-500 rounded-xl h-[30vh] px-7 p-4 text-white shadow-lg flex items-center justify-between"> {/* Corrected to vh */}
      <div>
        <h1 className="font-bold text-3xl">Welcome Back Dr. Ashit V. Hegde!</h1>
      </div>
      <div className="">
        <img className="h-[25vh]" src="https://hinduja-prod-assets.s3.ap-south-1.amazonaws.com/s3fs-public/2022-03/Ashit%20Hegde.png?VersionId=sMzNgniTwhILR5tHFw4YmC7peaecIHJZ" alt="" /> {/* Corrected to vh */}
      </div>
    </div>
  }

function CalendarComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border border-blue-500"
      />
  )
}