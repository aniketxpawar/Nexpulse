"use client"
import React, { useEffect, useState } from 'react'
import { FaStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Select from 'react-select';


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
  const getElements = async () => {
    if (!searchBy) {
      return
    }
    if (searchBy === 'specialization') {
      if (specialist.length) {
        return
      }
      const res = await axios.get('http://localhost:4000/user/get-specialist')
      console.log(res);
      const customSpecialist = res.data.map((specialist: string) => {
        return {
          value: specialist,
          label: specialist
        }
      })
      setSpecialist(customSpecialist)
    } else {
      if (tags.length) {
        return
      }
      const res = await axios.get('http://localhost:4000/user/get-tags')
      console.log(res);
      const customTags = res.data.map((tag: string) => {
        return {
          value: tag,
          label: tag
        }
      })
      setTags(customTags)
    }
  }
  const [searchBy, setSearchBy] = useState('')
  const [specialist, setSpecialist] = useState([])
  const [tags, setTags] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    getElements()
    setSelectedItems([])
  }, [searchBy])


  return (
    <div className='max-w-7xl mx-auto min-h-[80svh] mt-10 w-full'>
      <div>
        <h1 className="text-2xl font-bold mb-5">Find Doctors acording to you needs</h1>

        <div className='flex items-center gap-3'>
          <Select
            isMulti
            className='w-[70svw]'
            options={searchBy === 'specialization' ? specialist : tags}
            value={selectedItems} // Bind selected items to state
            onChange={(selected) => setSelectedItems(selected || [])} // Update selected items
            isClearable={true}
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className='w-[300px]'>
                {searchBy ? `Search By ${searchBy}` : 'Search By'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-[300px]'>
              <DropdownMenuLabel>Search By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => setSearchBy('specialization')}>Specialization</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => setSearchBy('keywords')}>Keywords</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
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
            <IoLocationOutline className='text-lg' />
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