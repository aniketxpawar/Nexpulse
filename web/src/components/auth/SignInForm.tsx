"use client";

import { useState } from "react"
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { Button } from "../ui/button";


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



const SignInForm = ({type} : {type: string}) => {
    const router = useRouter()
    const [data, setData] = useState({
        email: '',
        password: '',
    })


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const response = await axios.post('http://localhost:4000/user/login', data)
        localStorage.setItem('email', data.email)
        localStorage.setItem('role', type)
        console.log(response.data);
        router.push('verification')
    }
    return (
        <div className='bg-white p-6 rounded-xl flex flex-col gap-5 lg:w-[30svw] w-[90svw] border'>
            <h2 className="text-3xl font-bold">Sign-In as a {type}</h2>
            <form className="flex flex-col gap-5" onSubmit={(e) => handleSubmit(e)}>
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

            <Button type="submit">
                Sign In
            </Button>

            </form>

            <div className="flex justify-between">
                <p>Don't have an account? <a href={type=='Patient' ? "/signup": "/doctor-signup"} className="text-blue-500 hover:underline">Sign up</a></p>
                {
                    type === 'Patient' ? <p>Are you a doctor? <a href="/doctor-signin" className="text-blue-500 hover:underline">Sign in</a></p> : <p>Are you a patient? <a href="/signin" className="text-blue-500 hover:underline">Sign in</a></p>
                }
            </div>
        </div>
    )
}

export default SignInForm