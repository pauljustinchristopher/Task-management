// Validation utility functions

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  // At least 6 characters - matching backend validation
  return password && password.length >= 6;
};

// Name validation
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// Phone validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

// URL validation
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required field validation
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

// Min length validation
export const minLength = (value, min) => {
  if (typeof value === 'string') {
    return value.trim().length >= min;
  }
  return false;
};

// Max length validation
export const maxLength = (value, max) => {
  if (typeof value === 'string') {
    return value.trim().length <= max;
  }
  return false;
};

// Password confirmation validation
export const confirmPassword = (password, confirmation) => {
  return password === confirmation;
};

// Validation error messages
export const getValidationMessage = (field, rule, value) => {
  const messages = {
    required: `${field} is required`,
    email: 'Please enter a valid email address',
    password: 'Password must be at least 6 characters',
    minLength: `${field} must be at least ${value} characters`,
    maxLength: `${field} must not exceed ${value} characters`,
    confirmPassword: 'Passwords do not match',
    name: 'Name must be at least 2 characters',
    phone: 'Please enter a valid phone number',
    url: 'Please enter a valid URL'
  };
  
  return messages[rule] || `Invalid ${field}`;
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    fieldRules.forEach(rule => {
      if (typeof rule === 'string') {
        // Simple rule like 'required', 'email', etc.
        switch (rule) {
          case 'required':
            if (!isRequired(value)) {
              errors[field] = getValidationMessage(field, 'required');
            }
            break;
          case 'email':
            if (value && !isValidEmail(value)) {
              errors[field] = getValidationMessage(field, 'email');
            }
            break;
          case 'password':
            if (value && !isValidPassword(value)) {
              errors[field] = getValidationMessage(field, 'password');
            }
            break;
          case 'name':
            if (value && !isValidName(value)) {
              errors[field] = getValidationMessage(field, 'name');
            }
            break;
          case 'phone':
            if (value && !isValidPhone(value)) {
              errors[field] = getValidationMessage(field, 'phone');
            }
            break;
          case 'url':
            if (value && !isValidURL(value)) {
              errors[field] = getValidationMessage(field, 'url');
            }
            break;
        }
      } else if (typeof rule === 'object') {
        // Complex rule like { minLength: 6 }, { confirmPassword: 'password' }
        Object.keys(rule).forEach(ruleType => {
          const ruleValue = rule[ruleType];
          
          switch (ruleType) {
            case 'minLength':
              if (value && !minLength(value, ruleValue)) {
                errors[field] = getValidationMessage(field, 'minLength', ruleValue);
              }
              break;
            case 'maxLength':
              if (value && !maxLength(value, ruleValue)) {
                errors[field] = getValidationMessage(field, 'maxLength', ruleValue);
              }
              break;
            case 'confirmPassword':
              if (value && !confirmPassword(data[ruleValue], value)) {
                errors[field] = getValidationMessage(field, 'confirmPassword');
              }
              break;
          }
        });
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Example usage:
/*
const formData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'Password123',
  confirmPassword: 'Password123'
};

const validationRules = {
  firstName: ['required', 'name'],
  lastName: ['required', 'name'],
  email: ['required', 'email'],
  password: ['required', 'password'],
  confirmPassword: ['required', { confirmPassword: 'password' }]
};

const { isValid, errors } = validateForm(formData, validationRules);
*/

export default {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidPhone,
  isValidURL,
  isRequired,
  minLength,
  maxLength,
  confirmPassword,
  getValidationMessage,
  validateForm
};