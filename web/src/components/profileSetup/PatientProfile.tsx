"use client";
import React, { useState } from 'react'
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';


const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

const PatientProfile = () => {
    const router = useRouter()
    const [data, setData] = useState({
        userId: localStorage.getItem('userId'),
        role: localStorage.getItem('role'),
        profilePic: "",
        phone: "",
        city: "",
        dob: "",
        gender: ""
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:4000/user/set-profile', data)
            console.log(response.data);
            router.push('/doctors')
        }catch(err){
            console.log(err)
            // @ts-ignore
            toast.error(err.response.data.error)
        }
    }
    return (
        <div className='bg-white p-6 rounded-xl flex flex-col gap-5 lg:w-[30svw] w-[90svw] border'>
            <h2 className="text-3xl font-bold">Complete Your Profile</h2>
            <form className="flex flex-col gap-5" onSubmit={(e) => handleSubmit(e)}>
                <LabelInputContainer>
                    <Label htmlFor="profilePic">Profile Pic</Label>
                    <Input
                        type="profilePic"
                        name="profilePic"
                        id="profilePic"
                        placeholder="Profile Pic URL"
                        onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                    />
                </LabelInputContainer>

                <LabelInputContainer>
                    <Label htmlFor="dob">Date Of Birth</Label>
                    <Input
                        type="date"
                        name="dob"
                        id="dob"
                        placeholder="dob"
                        onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                    />
                </LabelInputContainer>

                <div className='flex gap-4'>
                    <LabelInputContainer>
                        <Label htmlFor="phone">Phone No.</Label>
                        <Input
                            type="phone"
                            name="phone"
                            id="phone"
                            placeholder="phone"
                            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                        />
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="gender">Gender</Label>
                        <Input
                            type="text"
                            name="gender"
                            id="gender"
                            placeholder="gender"
                            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                        />
                    </LabelInputContainer>

                </div>

                <LabelInputContainer>
                    <Label htmlFor="city">City</Label>
                    <Input
                        type="city"
                        name="city"
                        id="city"
                        placeholder="city"
                        onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                    />
                </LabelInputContainer>
                <Button type="submit">
                    Sign In
                </Button>

            </form>
        </div>
    )
}

export default PatientProfile