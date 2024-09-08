import { Request, Response } from "express"
import { sendEmail } from "../services/sendEmail";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { userService } from "../services/userService";

const signup = async (req: Request,res: Response) => {
    const { fullName, password, phone, email, city, role } = req.body;

  if (!fullName || !password || !phone || !email || !city || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Create user
    const user = await userService.createUser({
        fullName,
        password: hashedPassword,
        phone,
        email,
        city,
        role,
      })

    // Send OTP email
    sendEmail(email,'Nexpulse Verification Code',`Your OTP code is ${otp}`);

    // Respond with success
    res.status(201).json({ message: 'User created successfully, check your email for OTP' });
}catch(err){
    console.log(err);
    res.status(500).json({message:"Internal Server Error"})
}
}

export const userController = {
    signup,
  };