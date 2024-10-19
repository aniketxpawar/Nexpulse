"use client";
import React from "react";
import SignupForm from "@/components/doctor-signup/SignupForm";

export default function Signup() {
  return (
    <div className="relative h-[95svh] w-[100svw]">
      <div className="absolute inset-0 h-[95svh] w-[100svw] bg-[url('https://i.pinimg.com/564x/64/e7/db/64e7dbeba2ca84a4599619886598f8d2.jpg')] bg-cover"></div>
      <div className="absolute inset-0 bg-blue-700 bg-opacity-50"></div>
      <div className="relative flex items-center justify-center">
        <div className="w-1/2"></div>
        <div className="w-1/2 h-[95svh] flex items-center justify-center">
        <SignupForm/>
        </div>
      </div>
    </div>
  );
}
