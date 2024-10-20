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

const DoctorProfile = () => {
    const router = useRouter()
    const [data, setData] = useState({
        userId: localStorage.getItem('userId'),
        role: 'doctor',
        profilePic: "",
        phone: "",
        city: "",
        specialization: '',
        experience: "",
        licenseNumber: '',
        licenseAuthority: '',
        licenseExpiry: '',
        consultationCharge: '',
        clinicAddress: '',
        profile: ''
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(data);
        
        try {
            const response = await axios.post('http://localhost:4000/user/set-profile', data)
            console.log(response.data);
            router.push('/dashboard/home')
        }catch(err){
            console.log(err)
            // @ts-ignore
            toast.error(err.response.data.error)
        }
    }
    return (
        <div className='bg-white p-6 rounded-xl flex flex-col gap-5 lg:w-[30svw] w-[90svw] border my-10'>
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
                        <Label htmlFor="specialization">Specialization</Label>
                        <select
                            name="specialization"
                            id="specialization"
                            value={data.specialization}
                            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                            className='flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
          file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
          focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
           disabled:cursor-not-allowed disabled:opacity-50
           dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
           group-hover/input:shadow-none transition duration-400'
                        >
                            <option value="">Select Specialization</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="General Medicine">General Medicine</option>
                            <option value="Neurologist">Neurology</option>
                            <option value="Pediatrician">Pediatrics</option>
                            <option value="Dermatologist">Dermatology</option>
                            {/* Add more specializations as needed */}
                        </select>
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="experience">Experience (in years)</Label>
                        <Input
                            type="number"
                            name="experience"
                            id="experience"
                            placeholder="experience"
                            onChange={(e) => setData({ ...data, [e.target.name]: Number(e.target.value) })}
                        />
                    </LabelInputContainer>
                </div>


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

                <div className='flex gap-4'>
                    <LabelInputContainer>
                        <Label htmlFor="licenseNumber">Medical License Number</Label>
                        <Input
                            type="text"
                            name="licenseNumber"
                            id="licenseNumber"
                            placeholder="License Number"
                            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                        />
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="licenseAuthority">License Authority</Label>
                        <Input
                            type="text"
                            name="licenseAuthority"
                            id="licenseAuthority"
                            placeholder="License Authority"
                            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                        />
                    </LabelInputContainer>

                </div>

                <div className='flex gap-4'>
                    <LabelInputContainer>
                        <Label htmlFor="licenseExpiry">License Expiry</Label>
                        <Input
                            type="date"
                            name="licenseExpiry"
                            id="licenseExpiry"
                            placeholder="licenseExpiry"
                            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                        />
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="consultationCharge">Consultation Charges (in Rupees)</Label>
                        <Input
                            type="number"
                            name="consultationCharge"
                            id="consultationCharge"
                            placeholder="Consultation Charge"
                            onChange={(e) => setData({ ...data, [e.target.name]: Number(e.target.value) })}
                        />
                    </LabelInputContainer>

                </div>


                <div className='flex gap-4'>
                    <LabelInputContainer>
                        <Label htmlFor="clinicAddress">Clinic Address</Label>
                        <Input
                            type="text"
                            name="clinicAddress"
                            id="clinicAddress"
                            placeholder="Clinic Address"
                            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                        />
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="city">City</Label>
                        <Input
                            type="text"
                            name="city"
                            id="city"
                            placeholder="city"
                            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                        />
                    </LabelInputContainer>

                </div>

                <LabelInputContainer>
                        <Label htmlFor="profile">Your Bio</Label>
                        <Input
                            type="text"
                            name="profile"
                            id="profile"
                            placeholder="profile"
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

export default DoctorProfile