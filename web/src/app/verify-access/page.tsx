"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSearchParams } from "next/navigation";
import axios from 'axios';
import toast from 'react-hot-toast';


const Home = () => {
    const searchParams = useSearchParams();
    const key = searchParams.get("key"); // Extracts 'key' from URL

    const [time, setTime] = useState('day')


    const giveAccess = async () => {
        try{
            const res = await axios.post(`http://localhost:4000/medical/validateAccess`, {
                key,
                time
            })
            toast.success("Access given successfully")
            console.log(res.data);
        }catch(e){
            toast.error("An error occured")
            console.log(e);
        }   
    }


    return (
        <div className='max-w-7xl mx-auto py-10 w-full'>
            <h1 className='text-3xl font-bold text-center'>Verify Access To Your Medical Records</h1>


            <div className='flex flex-col items-center justify-center mt-10'>

                <h1 className='text-2xl font-semibold'>Give access for:</h1>

                <div className='flex gap-5 mt-5'>
                    <Button onClick={() => setTime('day')} className={`${time == 'day' ? "bg-blue-700 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} `}> 1 day</Button>
                    <Button onClick={() => setTime('week')} className={`${time == 'week' ? "bg-blue-700 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} `}> 1 week</Button>
                    <Button onClick={() => setTime('month')} className={`${time == 'month' ? "bg-blue-700 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} `}> 1 month</Button>
                    <Button onClick={() => setTime('year')} className={`${time == 'year' ? "bg-blue-700 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} `}> 1 year</Button>
                </div>

                <Button className='bg-blue-500 hover:bg-blue-600 w-96 mt-16' onClick={giveAccess}>Give Access</Button>
            </div>
        </div>
    )
}

export default Home