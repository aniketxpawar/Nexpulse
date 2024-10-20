"use client"

import DoctorProfile from "@/components/profileSetup/DoctorProfile"
import PatientProfile from "@/components/profileSetup/PatientProfile"

const Home = () => {
  const role = localStorage.getItem('role')
  
  return (
    <div className="flex items-center justify-center min-h-[80svh]">
        {
            role === 'patient' ? (
                <PatientProfile/>
            ) : (
                <DoctorProfile/>
            )
        }
    </div>
  )
}

export default Home