// Validation utilities for registration form

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Validate email format
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.trim()) {
    return { isValid: false, error: "Email is required" };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  
  return { isValid: true };
};

// Validate password strength
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long" };
  }
  
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { isValid: false, error: "Password must contain at least 1 letter and 1 number" };
  }
  
  return { isValid: true };
};

// Validate password confirmation
export const validatePasswordConfirmation = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: "Please confirm your password" };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords do not match" };
  }
  
  return { isValid: true };
};

// Validate display name
export const validateDisplayName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: "Display name is required" };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: "Display name must be at least 2 characters long" };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: "Display name must not exceed 50 characters" };
  }
  
  return { isValid: true };
};

// Get password strength level
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak';
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (score >= 3 && password.length >= 12) return 'strong';
  if (score >= 2 && password.length >= 8) return 'medium';
  return 'weak';
}; 