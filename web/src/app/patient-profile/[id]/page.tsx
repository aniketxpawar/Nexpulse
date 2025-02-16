"use client"
import { patientPic } from '@/assets/defaultProfiles'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cardio } from 'ldrs'
import { MdMessage } from 'react-icons/md'
import { IoIosCall } from 'react-icons/io'
import { Button } from '@/components/ui/button'
cardio.register()

const Profile = () => {
  const userId = (() => localStorage.getItem('userId'))()
  const id = useParams().id
  const [patient, setPatient] = useState();
  const [loading, setLoading] = useState(true)
  const [chat, setChat] = useState(false)

  const getPatient = async () => {
    const res = await axios.post(`http://localhost:4000/user/get-patient`, {
      patientId: id,
      userId: userId
    })
    console.log(res.data);
    setPatient(res.data.patient)
    setChat(res.data)
    setLoading(false)
  }
  useEffect(() => {
    getPatient()
  }, [])

  function formatDateTime(dateString: Date) {
    const date = new Date(dateString);

    // Options to format the date as "Mon Oct 28 2024, 7:00 PM"
    const options = {
      // year: "numeric", // "2024"
      dateStyle: "full", // "Monday, October 28, 2024"
      // month: "long", // "Oct"
      // timeZone: "IST", // Keep it in UTC
    };

    // Format the date using the options
    return date.toLocaleString("en-US", options);
  }
  return (
    <div className='w-full max-w-7xl mx-auto min-h-[80svh]'>
      {loading ? <div className='flex items-center justify-center w-full h-[80svh]'>
        <l-cardio
          size="150"
          stroke="10"
          speed="1"
          color="skyblue"
        ></l-cardio>
      </div> :
        <>
          <div className='flex border items-center rounded-lg px-4 py-3 gap-5 mt-10'>
            <img src={patient?.user?.profilePic ? patient?.user.profilePic : patientPic} alt={patient?.user.fullName} className='w-48 h-48 object-contain' />
            <div className='w-full'>
              <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold'>{patient?.user.fullName}</h1>
              </div>
              <h2>Gender: {patient?.gender}</h2>
              {/* convert DOB from UTC to local time */}
              <h1>Date of birth: {formatDateTime(patient.dob)}</h1>
              <h1 className='flex items-center gap-1'>{patient?.city}</h1>
              <div className='flex gap-3 mt-2 text-sm'>
                <a className='flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white gap-2 rounded-lg py-2 w-[180px] hover:cursor-pointer'>
                  <MdMessage />
                  <span>Message</span>
                </a>
                <a className='flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white gap-2 rounded-lg py-2 w-[180px] hover:cursor-pointer'>
                  <IoIosCall/>
                  <span>{patient?.user.phone}</span>
                </a>
              </div>
            </div>
          </div>

          <div className='border p-5 rounded-lg mt-5 max-h-[100svh] overflow-y-auto'>
            {
              localStorage.getItem('role') === 'doctor' && 
              <div className='w-full h-[40svh] border rounded-lg flex flex-col'>
                <h1 className='text-xl w-full font-bold text-center mb-5'>Your Prescriptions</h1>
              </div>
            }
            

            <div className='w-full h-[40svh] border rounded-lg flex flex-col items-center justify-center'>
            <h1 className='text-center font-bold text-xl mb-3 mt-5'>{patient?.user?.fullName}'s Medical Records</h1>
              <h1 className='text-3xl font-bold text-gray-300 max-w-2xl text-center mb-5'>{patient?.user?.fullName}'s Medical Records Not Accessible</h1>
              <Button className='bg-blue-500 hover:bg-blue-600'>Request Access</Button>
            </div>
          </div>
        </>}

    </div>
  )
}

export default Profile