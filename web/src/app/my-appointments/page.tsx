"use client"
import React, { useEffect } from 'react'
import { RiRadioButtonLine } from "react-icons/ri"
import { MdPeople } from "react-icons/md";
import { IoCalendar } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import axios from 'axios';
import { cardio } from 'ldrs'
cardio.register()

const page = () => {
    const [loading, setLoading] = React.useState(true)
    const [patient, setPatient] = React.useState()
    const userId = (() => localStorage.getItem('userId'))()
    const fetchPatientData = async () => {
        const res = await axios.post('http://localhost:4000/user/get-patient', {
            patientId: userId,
            userId: userId
        })
        console.log(res);
        setPatient(res.data.patient)
    }
    const fetchAppointments = async () => {
        const res = await axios.get(`http://localhost:4000/appointment/getAppointments/${userId}`)
        console.log(res);
        setUpComingAppointments(res.data)
        setLoading(false)
    }

    useEffect(() => {
        fetchPatientData()
        fetchAppointments()
    }, [])

    const [upComingAppointments, setUpComingAppointments] = React.useState([])
    const defaultProfilePic = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngitem.com%2Fpimgs%2Fm%2F551-5510463_default-user-image-png-transparent-png.png&f=1&nofb=1&ipt=a1e0abf157ee5d0b0dad35a4ccc2ae43b90d9ee39fd38cc09f9e5a917c90eaad&ipo=images'
    const defaultDoctorPic = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fmale-user-icons-2%2F500%2Fmuser-dr1-512.png&f=1&nofb=1&ipt=878bb4538e54a271464416c1b1c567df2f7338c4a0e060d628bea1a41aff23cc&ipo=images"
    function formatDateString(dateString) {
        const date = new Date(dateString); // Parse the date string

        // Define arrays for day and month names
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Extract day, month, year, hours, and minutes
        const dayOfWeek = daysOfWeek[date.getDay()]; // Get day of the week
        const month = months[date.getMonth()]; // Get month name
        const day = String(date.getDate()).padStart(2, '0'); // Day of the month
        const year = date.getFullYear(); // Full year
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Determine AM or PM
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format

        // Format the date string
        return `${dayOfWeek}, ${month} ${day}, ${year} at ${hours}:${minutes} ${period}`;
    }

    return (
        <div className='w-full max-w-7xl mx-auto my-10 flex flex-col gap-5'>
            {
                loading ? <div className='flex items-center justify-center w-full h-[80svh]'>
                    <l-cardio
                        size="150"
                        stroke="10"
                        speed="1"
                        color="skyblue"
                    ></l-cardio>
                </div> :
                    <>
                        <div className='flex border items-center rounded-lg px-4 py-3 gap-5'>
                            <img src={patient.user.profilePic ? patient.user.profilePic : defaultProfilePic} alt={patient.user.fullName} className='w-48 h-48 object-contain' />
                            <div className='w-full'>
                                <div className='flex items-center justify-between'>
                                    <h1 className='text-3xl font-bold'>{patient.user.fullName}</h1>
                                </div>
                                <h2>{patient.gender}</h2>
                                <h1>Date of birth: {patient.dob}</h1>
                                <h1 className='flex items-center gap-1'>{patient.city}</h1>
                            </div>


                        </div>
                        <div className='w-full border p-5 rounded-lg'>
                            <h1 className='text-xl font-bold'>Your Upcoming Appointments</h1>
                            {
                                upComingAppointments.map((appointment) => {
                                    return (
                                        <div key={appointment.id} className='flex items-center gap-5 mt-5 border-t pt-3'>
                                            <img src={appointment.doctor.profilePic ? appointment.doctor.profilePic : defaultDoctorPic} alt={appointment.doctor.fullName} className='w-36 h-36 object-contain' />
                                            <div className='w-full flex justify-between items-center'>
                                                <div>
                                                    <h1 className='text-xl font-bold'>{appointment.doctor.user.fullName}</h1>
                                                    <h2>{appointment.doctor.specialization}</h2>
                                                    <h2 className='flex items-center gap-1 mt-2'><IoCalendar /> {formatDateString(appointment.appointmentDate)}</h2>
                                                    <h2>{appointment.type == 'online' ?
                                                        <span className='flex items-center gap-2'><RiRadioButtonLine /> Online Appointment</span> :
                                                        <span className='flex items-center gap-2'><MdPeople /> Clinic Appointment</span>}</h2>
                                                    {appointment.type == 'offline' && <h2 className='flex gap-1 items-center'>
                                                        <IoLocation />
                                                        <span>{appointment.doctor.clinicAddress}</span>
                                                    </h2>}
                                                    {
                                                        appointment.healthConcern && <h2 className='mt-2'>Health Concerns: {appointment.healthConcern}</h2>
                                                    }
                                                </div>
                                                <a href={`http://localhost:3000/doctors/${appointment.doctor.userId}`} target="_blank" className='text-white text-sm bg-blue-500 px-4 rounded-lg py-2 flex gap-2 items-center'>
                                                    Doctor Profile
                                                    <FaExternalLinkAlt />
                                                </a>
                                                {
                                                    appointment.type === 'online' ?
                                                        <a target='_blank' href={'http://localhost:5173/meeting/0c1ae4f3-1c07-43e0-881a-63845997356e'} className='text-white bg-blue-500 px-4 rounded-lg py-2 flex gap-2 items-center'>
                                                            Join Meeting
                                                            <FaExternalLinkAlt />
                                                        </a> :
                                                        <h1 className='text-gray-400 font-semibold'>Offline Appointment</h1>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>
            }
        </div>
    )
}

export default page