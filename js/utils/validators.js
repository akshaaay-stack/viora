/**
 * VIORA Form Validation Helpers
 */

export function validatePhone(phone) {
  if (!phone) return { isValid: false, message: 'Phone number is required' };
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.length < 10) {
    return { isValid: false, message: 'Please enter a valid phone number (minimum 10 digits)' };
  }
  return { isValid: true, cleaned };
}

export function validateEmail(email) {
  if (!email) return { isValid: true, cleaned: null }; // Optional
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, cleaned: email.trim().toLowerCase() };
}

export function validateRequired(value, fieldName = 'This field') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true };
}

export function validateUnits(units) {
  const num = parseInt(units, 10);
  if (isNaN(num) || num < 1 || num > 20) {
    return { isValid: false, message: 'Units required must be between 1 and 20' };
  }
  return { isValid: true, value: num };
}
