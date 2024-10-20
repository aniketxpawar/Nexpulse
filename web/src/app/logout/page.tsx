"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {
    const router = useRouter()
    useEffect(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('role')
        localStorage.removeItem('userId')
        localStorage.removeItem('email')
        router.push('/signin')
    }, [])
    return (
        <div className='min-w-[80svh]'></div>
    )
}

export default Page