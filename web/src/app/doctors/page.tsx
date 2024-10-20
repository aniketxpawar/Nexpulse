"use client"
import React, { useEffect, useState } from 'react'
import { FaStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { cardio } from 'ldrs'
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
import { patientPic } from '@/assets/defaultProfiles';

cardio.register()
interface Doctor {
  id: number,
  name: string,
  speciality: string,
  location: string,
  rating: number,
  experience: number
}

const Home = () => {
  const getElements = async () => {
    if (!searchBy) {
      return
    }
    if (searchBy === 'specialization') {
      if (specialist.length) {
        return
      }
      const res = await axios.get('http://localhost:4000/user/get-specialist')
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
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    getElements()
    setSelectedItems([])
  }, [searchBy])
  const getDoctors = async () => {
    const selectedValues = selectedItems.map((item: any) => item.value)
    const res = await axios.post('http://localhost:4000/user/getDoctors', {
      specialist: searchBy === 'specialization' ? selectedValues : [],
      tags: searchBy === 'keywords' ? selectedValues : []
    })
    console.log("doctors" , res);
    setDoctors(res.data)
    setLoading(false)
  }
  useEffect(() => {
    getDoctors()
    setLoading(true)
  }, [selectedItems])

  const [loading, setLoading] = useState(false)
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
            // @ts-ignore
            onChange={(selected) => {
              console.log(selected);
              
              setSelectedItems(selected || [])} // Update selected items
            }
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
      {
        loading ? (
          <div className="flex items-center justify-center w-full h-[80svh]">
            <l-cardio size="150" stroke="10" speed="1" color="skyblue"></l-cardio>
          </div>
        ) :
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-3 mt-5 gap-y-4'>
        
        {
          doctors.length === 0 ? <h1 className='text-3xl font-bold text-gray-300'>No Doctors Found</h1>:<>
          {doctors.map(doctor => doctorCard(doctor))}</>
        }
        
      </div>
      }
      
    </div>
  )
}

export default Home


const doctorCard = ({ id, name, specialization, clinicAddress, rating, experience, user }) => {
  return (
    <div className="max-w-md bg-white border relative border-gray-200 rounded-lg shadow h-min">
      
      <img className="rounded-lg object-contain mt-2 h-48 w-full" src={user.profilePic ? user.profilePic : patientPic} alt="" />
      <div className="p-3">
        <a href="#">
          <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">{user.fullName}</h5>
        </a>

        <p className="font-normal">{specialization}</p>
        <div className='flex items-center justify-between'>
          <p className="font-normal text-gray-700 dark:text-gray-400">{experience} years of experience</p>
        </div>
        <div className='flex items-end justify-between'>
          <p className='flex items-center gap-1 text-sm'>
            <IoLocationOutline className='text-lg' />
            {clinicAddress.length > 10 ? `${clinicAddress.slice(0, 10)}...` : clinicAddress}
          </p>
          <a href={`/doctors/${user.id}`} className="inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 ">
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