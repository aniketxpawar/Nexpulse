import React from 'react'
import { RiRadioButtonLine } from "react-icons/ri"
import { MdPeople } from "react-icons/md";
import { IoCalendar } from "react-icons/io5";
import { FaExternalLinkAlt } from "react-icons/fa";

const page = () => {
    const patient = {
        id: 1,
        fullName: 'John Doe',
        profilePic: '',
        city: 'New York',
        dob: '1990-01-01',
        gender: 'male'
    }

    const upComingAppointments = [
        {
            id: 1,
            doctor: {
                id: 1,
                fullName: 'Dr. Jane Doe',
                profilePic: '',
                speciality: 'Cardiologist'
            },
            date: '2022-01-01',
            time: '10:00 AM',
            type: 'online',
            issue: 'Heart pain',
            link: 'https://meet.google.com/abc-xyz'

        },
        {
            id: 1,
            doctor: {
                id: 1,
                fullName: 'Dr. Jane Doe',
                profilePic: '',
                speciality: 'Cardiologist'
            },
            date: '2022-01-01',
            time: '10:00 AM',
            type: 'offline',
            issue: 'Heart pain',
            link: 'https://meet.google.com/abc-xyz'

        }
    ]
    const defaultProfilePic = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngitem.com%2Fpimgs%2Fm%2F551-5510463_default-user-image-png-transparent-png.png&f=1&nofb=1&ipt=a1e0abf157ee5d0b0dad35a4ccc2ae43b90d9ee39fd38cc09f9e5a917c90eaad&ipo=images'
    const defaultDoctorPic = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn3.iconfinder.com%2Fdata%2Ficons%2Fmale-user-icons-2%2F500%2Fmuser-dr1-512.png&f=1&nofb=1&ipt=878bb4538e54a271464416c1b1c567df2f7338c4a0e060d628bea1a41aff23cc&ipo=images"
    return (
        <div className='w-full max-w-7xl mx-auto my-10 flex flex-col gap-5'>
            <div className='flex border items-center rounded-lg px-4 py-3 gap-5'>
                <img src={patient.profilePic ? patient.profilePic : defaultProfilePic} alt={patient.fullName} className='w-48 h-48 object-contain' />
                <div className='w-full'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-3xl font-bold'>{patient.fullName}</h1>
                    </div>
                    <h2>{patient.gender}</h2>
                    <h1>Date of birth: {patient.dob}</h1>
                    <h1 className='flex items-center gap-1'>{patient.city}</h1>
                </div>


            </div>
            <div className='w-full border p-5 rounded-lg'>
                <h1 className='text-xl font-bold'>Your Upcoming Appointments</h1>
                {
                    upComingAppointments.map((appointment) => (
                        <div key={appointment.id} className='flex items-center gap-5 mt-5 border-t pt-3'>
                            <img src={appointment.doctor.profilePic ? appointment.doctor.profilePic : defaultDoctorPic} alt={appointment.doctor.fullName} className='w-36 h-36 object-contain' />
                            <div className='w-full flex justify-between items-center'>
                                <div>
                                    <h1 className='text-xl font-bold'>{appointment.doctor.fullName}</h1>
                                    <h2>{appointment.doctor.speciality}</h2>
                                    <h2 className='flex items-center gap-1 mt-2'><IoCalendar /> {appointment.date} {appointment.time}</h2>
                                    <h2>{appointment.type == 'online' ?
                                        <span className='flex items-center gap-2'><RiRadioButtonLine /> Online Appointment</span> :
                                        <span className='flex items-center gap-2'><MdPeople /> Clinic Appointment</span>}</h2>
                                    <h2 className='mt-2'>Problems Faced: {appointment.issue}</h2>
                                </div>
                                {
                                    appointment.type === 'online' ?
                                        <a href={appointment.link} className='text-white bg-blue-500 px-4 rounded-lg py-2 flex gap-2 items-center'>
                                            Join Meeting
                                            <FaExternalLinkAlt />
                                        </a> :
                                        <h1 className='text-gray-400 font-semibold'>Offline Appointment</h1>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default page