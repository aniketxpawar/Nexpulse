import { Request, Response } from "express"
import { sendEmail } from "../services/sendEmail";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {sign} from "jsonwebtoken";
import { userService } from "../services/userService";
import { getValueByKey, setKeyValueWithExpiry, smembersWithKey } from "../services/redisServices";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const signup = async (req: Request,res: Response) => {
    const { fullName, password, email, role } = req.body;

  if (!fullName || !password || !email || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Create user
    const user = await userService.createUser({
        fullName,
        password: hashedPassword,
        email,
        role,
      })

    const redis = await setKeyValueWithExpiry(email,otp, 5*60)
    if(!redis) return res.status(400).json({"message":"Error setting key value pair"})
    // Send OTP email
    sendEmail(email,'Nexpulse Verification Code',`Your OTP code is ${otp}`);

    // Respond with success
    res.status(201).json({ message: 'User created successfully, check your email for OTP' });
}catch(err){
    console.log(err);
    res.status(500).json({message:"Internal Server Error"})
}
}

const validateOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;  // Assumes the input is in the request body

  try {
    // Step 1: Retrieve OTP from Redis
    const storedOtp = await getValueByKey(email);  // The key is the email

    // Step 2: Check if OTP matches
    if (!storedOtp) {
      return res.status(400).json({ message: 'OTP Expired' });
    }
    if (storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Step 3: Find the user based on the email
    const user = await userService.getUserByEmail(email)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let hasProfile = false;
    if (user.role === 'doctor' && user.doctor) {
      hasProfile = true
    }

    if (user.role === 'patient' && user.patient) {
      hasProfile = true
    }

    // Ensure JWT_SECRET is defined
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret is not defined' });
    }

    // Step 4: Generate JWT token
    const token = sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,  // This ensures that JWT_SECRET is being used
      { expiresIn: '7d' }  // Token expiry set to 7 days
    );

    // Step 5: Return user details and JWT token
    return res.json({
      userId: user.id,
      role: user.role,
      token,
      hasProfile
    });

  } catch (error) {
    console.error('Error validating OTP:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Step 1: Check if user exists
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Step 2: Compare the hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Step 3: Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Step 4: Store OTP in Redis with an expiry (e.g., 60 seconds)
    const redisResponse = await setKeyValueWithExpiry(email, otp, 5*60);
    if (!redisResponse) {
      return res.status(500).json({ error: 'Error setting OTP in Redis' });
    }

    // Step 5: Send OTP via email
    sendEmail(email, 'Nexpulse OTP Verification', `Your OTP is: ${otp}`);

    // Step 6: Respond with success
    return res.status(200).json({ message: 'OTP sent to your email' });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const setProfile = async (req: Request, res: Response) => {
  const { userId, role } = req.body; // Always received
  const { profilePic = "", phone = "", city = null } = req.body; // Common fields
  const { specialization, experience, licenseNumber, licenseAuthority, licenseExpiry, consultationCharge, clinicAddress, profile } = req.body; // Doctor fields
  const { dob, gender } = req.body; // Patient fields

  try {
    // Start a transaction to ensure atomicity
    await prisma.$transaction(async (prisma) => {
      // Step 1: Update user with common fields using userService
      await userService.updateUserProfile(Number(userId), { profilePic, phone, city });

      // Step 2: Check role and handle accordingly
      if (role === 'doctor') {
        const availability = {
          "Monday": [
            "2024-10-21T18:00:00.000Z",
            "2024-10-21T18:30:00.000Z",
            "2024-10-21T19:00:00.000Z",
            "2024-10-21T19:30:00.000Z",
            "2024-10-21T20:00:00.000Z",
            "2024-10-21T20:30:00.000Z"
          ],
          "Tuesday": [
            "2024-10-22T18:00:00.000Z",
            "2024-10-22T18:30:00.000Z",
            "2024-10-22T19:00:00.000Z",
            "2024-10-22T19:30:00.000Z",
            "2024-10-22T20:00:00.000Z",
            "2024-10-22T20:30:00.000Z"
          ],
        "Wednesday": [
            "2024-10-23T18:00:00.000Z",
            "2024-10-23T18:30:00.000Z",
            "2024-10-23T19:00:00.000Z",
            "2024-10-23T19:30:00.000Z",
            "2024-10-23T20:00:00.000Z",
            "2024-10-23T20:30:00.000Z"
          ],
        "Thursday": [
            "2024-10-24T18:00:00.000Z",
            "2024-10-24T18:30:00.000Z",
            "2024-10-24T19:00:00.000Z",
            "2024-10-24T19:30:00.000Z",
            "2024-10-24T20:00:00.000Z",
            "2024-10-24T20:30:00.000Z"
          ],
          "Friday": [
            "2024-10-25T18:00:00.000Z",
            "2024-10-25T18:30:00.000Z",
            "2024-10-25T19:00:00.000Z",
            "2024-10-25T19:30:00.000Z",
            "2024-10-25T20:00:00.000Z",
            "2024-10-25T20:30:00.000Z"
          ],
        "Saturday": [
            "2024-10-26T10:00:00.000Z",
            "2024-10-26T10:30:00.000Z",
            "2024-10-26T11:00:00.000Z",
            "2024-10-26T11:30:00.000Z",
            "2024-10-26T18:30:00.000Z",
            "2024-10-26T19:00:00.000Z",
            "2024-10-26T19:30:00.000Z",
            "2024-10-26T20:00:00.000Z",
            "2024-10-26T20:30:00.000Z"
          ],
        "Sunday": [
            "2024-10-26T10:00:00.000Z",
            "2024-10-26T10:30:00.000Z",
            "2024-10-26T11:00:00.000Z",
            "2024-10-26T11:30:00.000Z",
            "2024-10-27T18:00:00.000Z",
            "2024-10-27T18:30:00.000Z",
            "2024-10-27T19:00:00.000Z",
            "2024-10-27T19:30:00.000Z",
            "2024-10-27T20:00:00.000Z",
            "2024-10-27T20:30:00.000Z"
          ]
        }
        await userService.createDoctorProfile(Number(userId), { specialization, experience, licenseNumber, licenseAuthority, licenseExpiry, consultationCharge, clinicAddress, profile, availability });

      } else if (role === 'patient') {
        await userService.createPatientProfile(Number(userId), { dob, gender });
      } else {
        // Return response if the role is invalid
        return res.status(400).json({ message: 'Invalid role' });
      }
    });

    // Step 3: Respond with success (this happens only if no errors occur)
    return res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    // Make sure only one response is sent in case of an error
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};




const getDoctorById = async (req: Request, res: Response) => {
  const { doctorId, userId } = req.body; // Assume these are passed as route parameters

  try {
    // Step 1: Get doctor details
    const doctor = await userService.getDoctorsRecord(Number(doctorId))

    // Step 2: Check if doctor exists
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Step 3: Check if requester is not the doctor
    let chatExists = false;
    if (Number(userId) !== doctor.userId) {
      chatExists = await userService.checkChatExists(Number(userId), Number(doctorId))
    }

    // Step 5: Return doctor details along with chat existence
    return res.json({
      doctor,
      chatExists, // Attach chatExists field
    });

  } catch (error) {
    console.error('Error fetching doctor details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getSpecialist = async (req: Request, res: Response) => {
  try{
    const specialists = await smembersWithKey('specialist') || []
    res.json(specialists)
  } catch (error) {
    console.error('Error fetching specialists:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


export const userController = {
    signup,
    validateOTP,
    login,
    setProfile,
    getDoctorById,
    getSpecialist
  };