// src/utils/validationUtils.js

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return false;
  }
  
  const emailRegex = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates US phone number (10 digits, NANP rules)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateUSPhone = (phone) => {
  if (!phone || !phone.trim()) {
    return false;
  }
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  
  // Must be exactly 10 digits
  if (digitsOnly.length !== 10) {
    return false;
  }
  
  // Area code (first digit) can't be 0 or 1
  if (digitsOnly[0] === '0' || digitsOnly[0] === '1') {
    return false;
  }
  
  // Prefix (4th digit) can't be 0 or 1
  if (digitsOnly[3] === '0' || digitsOnly[3] === '1') {
    return false;
  }
  
  return true;
};

/**
 * Formats phone number as user types: (555) 123-4567
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  
  // Format based on length
  if (digitsOnly.length === 0) {
    return '';
  } else if (digitsOnly.length <= 3) {
    return digitsOnly;
  } else if (digitsOnly.length <= 6) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
  } else {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
  }
};

/**
 * Formats phone number for display with hyphens: XXX-XXX-XXXX
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneWithHyphens = (phone) => {
  if (!phone) return '';
  
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  
  if (digitsOnly.length === 0) return '';
  if (digitsOnly.length <= 3) return digitsOnly;
  if (digitsOnly.length <= 6) {
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
  }
  return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
};

/**
 * Gets just the digits from a phone number
 * @param {string} phone - Phone number
 * @returns {string} - Digits only
 */
export const getPhoneDigits = (phone) => {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
};

/**
 * Validates that a name is not empty
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateName = (name) => {
  return name && name.trim().length > 0;
};

/**
 * Gets user-friendly error messages
 */
export const getErrorMessage = {
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address'
  },
  phone: {
    required: 'Phone number is required',
    invalid: 'Please enter a valid 10-digit U.S. phone number',
    format: 'Format: (555) 123-4567 or 555-123-4567'
  },
  name: {
    required: 'Name is required'
  },
  date: {
    required: 'Date is required'
  },
  time: {
    required: 'Time is required'
  },
  service: {
    required: 'Please select at least one service'
  }
};