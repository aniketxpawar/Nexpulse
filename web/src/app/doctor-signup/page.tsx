"use client";
import SignupForm from "@/components/auth/SignUpForm";
import React from "react";

export default function Signup() {
  return (
    <div className="min-h-[80svh] min-w-7xl mx-auto flex items-center justify-center h-full ">
        <SignupForm type="Doctor"/>
    </div>
  );
}
