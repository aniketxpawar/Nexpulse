// components/SignupForm.tsx
import React, { useState, FormEvent } from 'react';
import { Step1, Step2, Step3} from './Steps';
import { SignupFormData, PersonalInfo, ProfessionalInfo, CredentialsVerification } from '@/types/form';
import { validateEmail, validatePhone, validatePositiveNumber } from '@/utils/validation';
import { Button } from '../ui/button';

const SignupForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<SignupFormData>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionMessage, setSubmissionMessage] = useState<string>('');

  // Validation function
  const validateStep = (): boolean => {
    let currentErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (step === 1) {
      const personalInfo = formData as PersonalInfo;

      if (!personalInfo.firstName || personalInfo.firstName.trim() === '') {
        currentErrors.firstName = 'First name is required';
      }

      if (!personalInfo.lastName || personalInfo.lastName.trim() === '') {
        currentErrors.lastName = 'Last name is required';
      }

      if (!personalInfo.email || personalInfo.email.trim() === '') {
        currentErrors.email = 'Email is required';
      } else if (!validateEmail(personalInfo.email)) {
        currentErrors.email = 'Invalid email address';
      }

      if (!personalInfo.phone || personalInfo.phone.trim() === '') {
        currentErrors.phone = 'Phone number is required';
      } else if (!validatePhone(personalInfo.phone)) {
        currentErrors.phone = 'Invalid phone number';
      }

      if (!personalInfo.dob || personalInfo.dob.trim() === '') {
        currentErrors.dob = 'Date of birth is required';
      }

      if (!personalInfo.address || personalInfo.address.trim() === '') {
        currentErrors.address = 'Residential address is required';
      }

      // Add more validations as needed
    } else if (step === 2) {
      const professionalInfo = formData as ProfessionalInfo;

      if (!professionalInfo.licenseNumber || professionalInfo.licenseNumber.trim() === '') {
        currentErrors.licenseNumber = 'License number is required';
      }

      if (!professionalInfo.specialization || professionalInfo.specialization.trim() === '') {
        currentErrors.specialization = 'Specialization is required';
      }

      if (
        professionalInfo.experience === undefined ||
        professionalInfo.experience === null ||
        // @ts-ignore
        professionalInfo.experience === ''
      ) {
        currentErrors.experience = 'Years of experience is required';
      } 
      // else if (!validatePositiveNumber(professionalInfo.experience)) {
      //   currentErrors.experience = 'Experience must be a positive number';
      // }

      if (!professionalInfo.institution || professionalInfo.institution.trim() === '') {
        currentErrors.institution = 'Affiliated institution is required';
      }

      // Add more validations as needed
    } else if (step === 3) {
      const credentials = formData as CredentialsVerification;

      if (!credentials.licenseFile) {
        currentErrors.licenseFile = 'Medical license is required';
      }

      if (!credentials.degreeFile) {
        currentErrors.degreeFile = 'Degree certificate is required';
      }

      if (!credentials.photoID) {
        currentErrors.photoID = 'Photo ID is required';
      }

      // Add more validations as needed
    }

    setErrors(currentErrors);

    return Object.keys(currentErrors).length === 0;
  };

  // Handle Next button
  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      setErrors({});
    }
  };

  // Handle Back button
  const handleBack = () => {
    setStep(prev => prev - 1);
    setErrors({});
  };

  // Handle Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validateStep()) {
      setIsSubmitting(true);
      setErrors({});
      setSubmissionMessage('');

      // Prepare FormData for submission
      const submissionData = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          submissionData.append(key, value);
        } else if (value !== undefined && value !== null) {
          submissionData.append(key, value.toString());
        }
      });

      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          body: submissionData,
        });

        const result = await response.json();

        if (response.ok) {
          setSubmissionMessage(result.message);
          // Optionally reset form
          setFormData({});
          setStep(1);
        } else {
          setSubmissionMessage(result.message || 'An error occurred');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmissionMessage('An unexpected error occurred');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Render current step component
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 formData={formData} setFormData={setFormData} errors={errors} />;
      case 2:
        return <Step2 formData={formData} setFormData={setFormData} errors={errors} />;
      case 3:
        return <Step3 formData={formData} setFormData={setFormData} errors={errors} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className={'bg-white p-6 rounded-xl'}>
      <h1>Doctor Signup</h1>

      <div className={'text-3xl font-bold'}>
        <div className={`${step==1 ? 'visible': 'hidden'}`}>
          1. Personal Information
        </div>
        <div className={`${step==2 ? 'visible': 'hidden'}`}>
          2. Professional Information
        </div>
        <div className={`${step==3 ? 'visible': 'hidden'}`}>
          3. Credentials
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}

        <div className={'flex gap-5'}>
          {step > 1 && (
            <Button type="button" onClick={handleBack} className={'w-full'}>
              Back
            </Button>
          )}
          {step < 3 && (
            <Button type="button" onClick={handleNext} className={'w-full'}>
              Next
            </Button>
          )}
          {step === 3 && (
            <Button type="submit" className={'w-full'} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
          <BottomGradient />
        </div>
      </form>

      {submissionMessage && <p className="submission-message">{submissionMessage}</p>}
    </div>
  );
};

export default SignupForm;


const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};