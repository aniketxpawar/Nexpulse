"use client";

import { useState } from "react"
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation';
import axios from "axios";
import toast from "react-hot-toast";


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



const SignupForm = ({type} : {type: string}) => {
    const router = useRouter()
    const [data, setData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: type
    })
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(data.password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        try{
            const response = await axios.post('http://localhost:4000/user/signup', data)
            console.log(response.data)
            toast.success(response.data.message)
            localStorage.setItem('email', data.email)
            localStorage.setItem('role', type)
            router.push('/verification');
        }catch(err){
            console.log(err)
            // @ts-ignore
            if(err?.response?.data?.error) toast.error(err?.response?.data?.error)
            else toast.error('An error occured')
        }
    }
    return (
        <div className='bg-white p-6 rounded-xl flex flex-col gap-5 lg:w-[30svw] w-[90svw] border'>
            <h2 className="text-3xl font-bold">Register as a {type}</h2>
            <form className="flex flex-col gap-5" onSubmit={(e) => handleSubmit(e)}>
            <LabelInputContainer>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    type="text"
                    name="fullName"
                    id="fullName"
                    placeholder="Full Name"
                    onChange={(e) => setData({...data, [e.target.name]: e.target.value})}
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    onChange={(e) => setData({...data, [e.target.name]: e.target.value})}
                />
            </LabelInputContainer>

            <LabelInputContainer>
            <Label htmlFor="passoword">Password</Label>
            <Input
                type="string"
                name="password"
                id="password"
                placeholder="Password"
                onChange={(e) => setData({...data, [e.target.name]: e.target.value})}
            />
            </LabelInputContainer>

            <LabelInputContainer>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
                type="text"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            </LabelInputContainer>

            <Button type="submit">
                Sign Up
            </Button>
            </form>

            <div className="flex justify-between">
                <p>Already have an account? <a href={type=='patient' ? "/signin": "/doctor-signin"} className="text-blue-500 hover:underline">Sign in</a></p>
                {
                    type === 'patient' ? <p>Are you a doctor? <a href="/doctor-signin" className="text-blue-500 hover:underline">Sign up</a></p> : <p>Are you a patient? <a href="/signin" className="text-blue-500 hover:underline">Sign up</a></p>
                }
            </div>
        </div>
    )
}

export default SignupForm