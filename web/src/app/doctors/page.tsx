import React from 'react'
import { FaStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";

interface Doctor {
  id: number,
  name: string,
  speciality: string,
  location: string,
  rating: number,
  experience: number
}

const Home = () => {
  const doctors = [
    {
      id: 1,
      name: 'Dr. John Doe',
      speciality: 'Cardiologist',
      location: 'New York',
      rating: 5,
      experience: 20
    },
    {
      id: 2,
      name: 'Dr. Jane Doe',
      speciality: 'Dentist',
      location: 'Los Angeles',
      rating: 4,
      experience: 20
    },
    {
      id: 3,
      name: 'Dr. John Doe',
      speciality: 'Cardiologist',
      location: 'New York',
      rating: 5,
      experience: 20
    },
    {
      id: 4,
      name: 'Dr. Jane Doe',
      speciality: 'Dentist',
      location: 'Los Angeles',
      rating: 4,
      experience: 20
    },
    {
      id: 5,
      name: 'Dr. John Doe',
      speciality: 'Cardiologist',
      location: 'New York',
      rating: 5,
      experience: 20
    },
    {
      id: 6,
      name: 'Dr. Jane Doe',
      speciality: 'Dentist',
      location: 'Los Angeles',
      rating: 4,
      experience: 20
    },
    {
      id: 7,
      name: 'Dr. John Doe',
      speciality: 'Cardiologist',
      location: 'New York',
      rating: 5,
      experience: 20
    },
    {
      id: 8,
      name: 'Dr. Jane Doe',
      speciality: 'Dentist',
      location: 'Los Angeles',
      rating: 4,
      experience: 20
    }
  ]
  return (
    <div className='max-w-7xl mx-auto min-h-[80svh] mt-10 w-full'>
      <div>
        <h1 className="text-2xl font-bold mb-5">Find Doctors acording to you needs</h1>

        <form>
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
          </div>
        </form>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-3 mt-5 gap-y-4'>
        {doctors.map(doctor => doctorCard(doctor))}
      </div>
    </div>
  )
}

export default Home


const doctorCard = ({ id, name, speciality, location, rating, experience }: Doctor) => {
  return (
    <div className="max-w-md bg-white border relative border-gray-200 rounded-lg shadow h-min">
      <p className="mb-3 absolute left-2 top-2 font-normal text-white text-sm bg-blue-500 border w-min px-3 py-1 rounded-lg">{speciality}</p>
      <img className="rounded-t-lg object-contain mt-2 h-48 w-full" src="https://hinduja-prod-assets.s3.ap-south-1.amazonaws.com/s3fs-public/2022-03/Ashit%20Hegde.png?VersionId=sMzNgniTwhILR5tHFw4YmC7peaecIHJZ" alt="" />
      <div className="p-3">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{name}</h5>
        </a>


        <div className='flex items-center justify-between'>

          <p className="font-normal text-gray-700 dark:text-gray-400">{experience} years of experience</p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex items-center gap-1">{rating}
            <FaStar className='text-yellow-400' />
          </p>
        </div>
        <div className='flex items-end justify-between'>
          <p className='flex items-center gap-1 text-sm'>
            <IoLocationOutline className='text-lg'/>
            {location}
          </p>
          <a href={`/doctors/10`} className="inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 ">
            View Profile
            <svg className="rtl:rotate-180 w-2.5 h-2.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </a>
        </div>
      </div>
    </div>

  )
}