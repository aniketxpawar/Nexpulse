"use client"
import Calendar from "@/components/common/calendar"
const defaultProfilePic = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngitem.com%2Fpimgs%2Fm%2F551-5510463_default-user-image-png-transparent-png.png&f=1&nofb=1&ipt=a1e0abf157ee5d0b0dad35a4ccc2ae43b90d9ee39fd38cc09f9e5a917c90eaad&ipo=images'
const defaultDoctorPic = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fmale-user-icons-2%2F500%2Fmuser-dr1-512.png&f=1&nofb=1&ipt=878bb4538e54a271464416c1b1c567df2f7338c4a0e060d628bea1a41aff23cc&ipo=images"
import { RiRadioButtonLine } from "react-icons/ri"
import { MdPeople } from "react-icons/md";
import { IoCalendar } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios"
import { cardio } from 'ldrs'
import { doctorPic } from "@/assets/defaultProfiles"
import MyTUICalendar from "@/components/common/calendar"
cardio.register()



export default function DashboardPage() {
  const userId = (() => localStorage.getItem('userId'))()
  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + 30);

  const getDoctor = async () => {
    const res = await axios.post('http://localhost:4000/user/get-doctor', {
      doctorId: userId,
      userId: userId
    })
    // console.log(res.data);
    setDoctor(res.data.doctor)
  }
  const getAppointments = async () => {
    const res = await axios.get(`http://localhost:4000/appointment/getAppointments/${userId}`)
    // console.log(res.data);
    setUpcomingAppointments(res.data)
    setLoading(false)
  }
  const [doctor, setDoctor] = useState()
  useEffect(() => {
    getDoctor()
    getAppointments()
  }, [])

  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  // const schedule = [
  //   {
  //     id: 1,
  //     title: "Appointment with John Doe",
  //     body: "link: https://meet.google.com/xyz",
  //     category: "time",
  //     start: new Date().toISOString(),
  //     end: currentDate.toISOString(),
  //   }
  // ]
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
        calendarId: index+1, 
        title: `Appointment with ${appointment.patient.user.fullName}`,
        body: `<a class='bg-blue-700 p-2 rounded-md text-white' href='${appointment.link}' target='_blank'>Join now</a>`,
        category: "time",
        start: addMinutesAndFormatUTC(appointment.appointmentDate, 0),
        end: addMinutesAndFormatUTC(appointment.appointmentDate, 30),
      };
    });
  console.log("new" ,newSchedule);
  setSchedules(newSchedule)
}, [upcomingAppointments])

  return (
    <div className="flex flex-1 flex-col min-h-screen pb-28 overflow-y-auto"> {/* Adjusted for dynamic height */}
      {
        loading ? <div className='flex items-center justify-center w-full h-[80svh]'>
          <l-cardio
            size="150"
            stroke="10"
            speed="1"
            color="skyblue"
          ></l-cardio>
        </div> :
          <div className="p-2 md:p-10 rounded-2xl border border-neutral-200 bg-white flex flex-col lg:flex-row w-full gap-4">
            <div className="w-full lg:w-3/4">
              <h1 className="font-bold mb-2 text-3xl">Welcome Back Dr. {doctor?.user.fullName}!</h1>
              <GreetCard doctor={doctor} upcoming={upcomingAppointments?.length}/>
              <PatientList upcomingAppointments={upcomingAppointments}/>
            </div>
            <div className="w-1/3 invisible lg:visible"> {/* Removed fixed height */}
              <h1 className="text-2xl font-bold mb-3">Your today's schedule</h1>
              <div className="p-5 border rounded-xl">
                <MyTUICalendar prop="day" schedule={schedules} />
              </div>
            </div>
          </div>}
    </div>
  );
}

function GreetCard({ doctor, upcoming }: { doctor: any; upcoming: number }) {
  console.log(doctor);
  console.log(upcoming);
  
  
  return <div className="bg-blue-500 mb-5 relative rounded-xl h-[35vh] px-7 p-4 text-white shadow-lg flex items-center justify-between">
    <div className="flex flex-col justify-between gap-7">

      <div>
        <h1 className="text-4xl font-extrabold mb-5">Upcoming Visits</h1>
        <h1 className="text-5xl font-extrabold">{upcoming}</h1>
      </div>

      <div className="flex gap-3">
        <div className="px-4 py-2 rounded-xl bg-blue-400">
          <h1 className="text-xl font-extrabold mb-2">Visits This Week</h1>
          <h1 className="text-xl font-extrabold">120</h1>
        </div>


        <div className="px-4 py-2 rounded-xl bg-blue-400">
          <h1 className="text-xl font-extrabold mb-2">Visits This Month</h1>
          <h1 className="text-xl font-extrabold">120</h1>
        </div>
      </div>
    </div>
    <img className="h-64 w-64 object-cover rounded-xl" src={doctor?.user?.profilePic ? doctor?.user?.profilePic : doctorPic} alt="" /> {/* Corrected to vh */}
    
  </div>
}

function PatientList({upcomingAppointments}: {upcomingAppointments: any}) {
  console.log(upcomingAppointments);
  
  return <div className="bg-white rounded-xl p-4 shadow-lg border">
    <h1 className="font-bold text-2xl pb-4">Upcoming Appointments</h1>
    <div className="grid grid-cols-1 gap-4 h-[60svh] overflow-y-scroll">
      {
        upcomingAppointments.map((appointment) => (
          <div key={appointment.id} className='flex items-center gap-5 border-t pt-3'>
            <img src={appointment.patient.profilePic ? appointment.patient.profilePic : defaultProfilePic} alt={appointment.patient.fullName} className='w-36 h-36 object-contain rounded-lg' />
            <div className='w-full flex justify-between items-center'>
              <div>
                <h1 className='text-xl font-bold'>{appointment.patient.user.fullName}</h1>
                <h2 className='flex items-center gap-2 mt-2'><IoCalendar /> {appointment.appointmentDate}</h2>
                <h2>{appointment.type == 'online' ?
                  <span className='flex items-center gap-2'><RiRadioButtonLine /> Online Appointment</span> :
                  <span className='flex items-center gap-2'><MdPeople /> Clinic Appointment</span>}</h2>
                <h2 className='mt-2'>Health Concerns: {appointment.healthConcern}</h2>
              </div>
              <a href={`http://localhost:3000/patient-profile/${appointment.patient.userId}`} target="_blank" className='text-white text-sm bg-blue-500 px-4 rounded-lg py-2 flex gap-2 items-center'>
                Patient Profile
                <FaExternalLinkAlt />
              </a>
              {
                appointment.type === 'online' ?
                  <a href={appointment.link} className='text-white text-sm bg-blue-500 px-4 rounded-lg py-2 flex gap-2 items-center'>
                    Join Meeting
                    <FaExternalLinkAlt />
                  </a> :
                  <h1 className='text-gray-400 font-semibold text-sm'>Offline Appointment</h1>
              }
            </div>
          </div>
        ))
      }
    </div>
  </div>
}
