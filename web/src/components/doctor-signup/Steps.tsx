// components/Step1.tsx
import React, { ChangeEvent } from 'react';
import { StepProps } from '@/types/form';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


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

const errorStyle = "text-red-500 text-xs px-3";

const Step1: React.FC<StepProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className='py-3'>
      <h2 className='text-3xl font-bold mb-3'>Personal Information</h2>

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <LabelInputContainer>
          <Label htmlFor="firstname">First name</Label>
          <Input
            id="firstName"
            placeholder="First name"
            type="text"
            name="firstName"
            value={formData.firstName || ''} onChange={handleChange} />
          {errors.firstName && <p className={`${errorStyle}`}>{errors.firstName}</p>}
        </LabelInputContainer>


        <LabelInputContainer>
          <Label htmlFor="lastname">Last name</Label>
          <Input
            id="lastname"
            placeholder="Last name"
            type="text"
            name="lastName"
            value={formData.lastName || ''} onChange={handleChange} />
          {errors.lastName && <p className={`${errorStyle}`}>{errors.lastName}</p>}
        </LabelInputContainer>
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder='Email'
            id="email"
            value={formData.email || ''}
            onChange={handleChange} />
          {errors.email && <p className={`${errorStyle}`}>{errors.email}</p>}
        </LabelInputContainer>
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <LabelInputContainer>
          <Label htmlFor="lastname">Phone Number</Label>
          <Input
            type="tel"
            name="phone"
            placeholder='Phone Number'
            id="phone"
            value={formData.phone || ''}
            onChange={handleChange}
          />
          {errors.phone && <p className={`${errorStyle}`}>{errors.phone}</p>}
        </LabelInputContainer>

        <LabelInputContainer>
          <Label htmlFor="lastname">Date Of Birth</Label>
          <Input
            type="date"
            name="dob"
            id="dob"
            value={formData.dob || ''}
            onChange={handleChange}
          />
          {errors.dob && <p className={`${errorStyle}`}>{errors.dob}</p>}
        </LabelInputContainer>

      </div>

      <LabelInputContainer>
        <Label htmlFor="address">Residential Address</Label>
        <Input
          type="text"
          name="address"
          id="address"
          placeholder="Street Address"
          value={formData.address || ''}
          onChange={handleChange}
        />
        {errors.address && <p className={`${errorStyle}`}>{errors.address}</p>}
      </LabelInputContainer>
      {/* Add more personal fields as needed */}
    </div>
  );
};

const Step2: React.FC<StepProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className='py-3 flex flex-col gap-3'>
      <h2 className='text-3xl font-bold mt-5'>Professional Information</h2>
      <LabelInputContainer>
        <Label htmlFor="licenseNumber">Medical License Number</Label>
        <Input
          type="text"
          name="licenseNumber"
          id="licenseNumber"
          value={formData.licenseNumber || ''}
          onChange={handleChange}
        />
        {errors.licenseNumber && <p className={`${errorStyle}`}>{errors.licenseNumber}</p>}
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="specialization">Specialization</Label>
        <select
          name="specialization"
          id="specialization"
          value={formData.specialization || ''}
          onChange={handleChange}
          className='flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
          file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
          focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
           disabled:cursor-not-allowed disabled:opacity-50
           dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
           group-hover/input:shadow-none transition duration-400'
        >
          <option value="">Select Specialization</option>
          <option value="cardiology">Cardiology</option>
          <option value="neurology">Neurology</option>
          <option value="pediatrics">Pediatrics</option>
          <option value="dermatology">Dermatology</option>
          {/* Add more specializations as needed */}
        </select>
        {errors.specialization && <p className="error">{errors.specialization}</p>}
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          type="number"
          name="experience"
          id="experience"
          value={formData.experience !== undefined ? formData.experience : ''}
          onChange={handleChange}
          min={0}
        />
        {errors.experience && <p className="error">{errors.experience}</p>}
      </LabelInputContainer>

      <Label htmlFor="institution">Affiliated Institution</Label>
      <Input
        type="text"
        name="institution"
        id="institution"
        placeholder="Hospital/Clinic Name"
        value={formData.institution || ''}
        onChange={handleChange}
      />
      {errors.institution && <p className="error">{errors.institution}</p>}

      {/* Add more professional fields as needed */}
    </div>
  );
};

const Step3: React.FC<StepProps> = ({ formData, setFormData, errors }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : null }));
  };

  return (
    <div>
      <h2 className='text-3xl font-bold'>Credentials Verification</h2>

      <Label htmlFor="licenseFile">Upload Medical License</Label>
      <Input
        type="file"
        name="licenseFile"
        id="licenseFile"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />
      {errors.licenseFile && <p className="error">{errors.licenseFile}</p>}

      <Label htmlFor="degreeFile">Upload Degree Certificate</Label>
      <Input
        type="file"
        name="degreeFile"
        id="degreeFile"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />
      {errors.degreeFile && <p className="error">{errors.degreeFile}</p>}

      <Label htmlFor="photoID">Upload Photo ID</Label>
      <Input
        type="file"
        name="photoID"
        id="photoID"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
      />
      {errors.photoID && <p className="error">{errors.photoID}</p>}

      {/* Add more credential fields as needed */}
    </div>
  );
};

export default Step3;

export { Step1, Step2, Step3 };
