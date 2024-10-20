"use client";

import React, { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";  // Changed from 'next/router'

export function InputOTPWithSeparator({ email } : { email: string }) {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  // @ts-ignore
  const handleOtpChange = (newValue) => {
    setOtp(newValue);
  };

  const submit = async () => {
    if (otp.length !== 6) {
      toast.error('Invalid OTP');
      return;
    }

    toast.promise(
      axios.post(`http://localhost:4000/user/validate-otp`, { email, otp }),
      {
        loading: 'verifying otp...',
        success: (res) => {
          if (res.status === 200) {
            console.log(res.data);
            localStorage.setItem('accessToken', res.data.token);
            localStorage.setItem('userId', res.data.userId);
            setTimeout(() => {
              if(res.data.hasProfile == false) router.push('/profile-completion')
              else if(localStorage.getItem('role') === 'doctor') router.push('/dashboard/home')
              else router.push('/doctors')
            }, 1000);
            return 'OTP verified successfully, Redirecting...';
          }
          return 'Something went wrong';
        },
        error: (err) => err.response.data.message,
      }
    ).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className="flex justify-between flex-col items-center">
      <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button onClick={submit} className="w-full mt-10">Submit</Button>
    </div>
  );
}

const OTPverify = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem('email') || "");
  }, []);

  return (
    <div className="wrapper-container flex items-center justify-center h-[70vh] mt-20">
      <div className="px-12 py-8 border h-80 rounded-xl shadow-xl flex flex-col justify-between">
        <h1 className="text-xl font-bold text-center">Email verification</h1>
        <p>Enter the OTP you have received at
          <span className="text-rr"> {email}</span>
        </p>
        <InputOTPWithSeparator email={email} />
      </div>
    </div>
  );
};

export default OTPverify;