// types/form.ts

// Interface for Personal Information
export interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string; // ISO Date string
    address: string;
  }
  
  // Interface for Professional Information
  export interface ProfessionalInfo {
    licenseNumber: string;
    specialization: string;
    experience: number;
    institution: string;
  }
  
  // Interface for Credentials Verification
  export interface CredentialsVerification {
    licenseFile: File | null;
    degreeFile: File | null;
    photoID: File | null;
  }
  
  // Combined Form Data Interface
  export interface SignupFormData extends PersonalInfo, ProfessionalInfo, CredentialsVerification {}
  
  // Interface for Step Components' Props
  export interface StepProps {
    formData: Partial<SignupFormData>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<SignupFormData>>>;
    errors: Partial<Record<keyof SignupFormData, string>>;
  }
  