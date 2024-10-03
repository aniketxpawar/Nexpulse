// utils/validation.ts

// Validate Email Format
export const validateEmail = (email: string): boolean => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  
  // Validate Phone Number (E.164 format)
  export const validatePhone = (phone: string): boolean => {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(phone);
  };
  
  // Validate Positive Number
  export const validatePositiveNumber = (number: number): boolean => {
    return typeof number === 'number' && number >= 0;
  };
  
  // Add more validation functions as needed
  