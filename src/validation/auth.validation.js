import Joi from 'joi';

export const registerSchema = Joi.object({
  serviceNumber: Joi.number().required().messages({
    'number.base': 'Service number must be a number',
    'any.required': 'Service number is required',
  }),
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().min(3).max(255).required().email().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'string.min': 'Email must be at least 3 characters long',
    'string.max': 'Email cannot exceed 255 characters',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(255).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 255 characters',
    'any.required': 'Password is required',
  }),
  role: Joi.string()
    .valid('SuperAdmin', 'Admin', 'Officer')
    .required()
    .messages({
      'any.only': 'Role must be one of Superadmin, Admin, or Officer',
      'any.required': 'Role is required',
    }),
});

// Schema for user login
export const loginSchema = Joi.object({
  serviceNumber: Joi.number().required().messages({
    'number.base': 'Service number must be a number',
    'any.required': 'Service number is required',
  }),
  password: Joi.string().min(6).max(255).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 255 characters',
    'any.required': 'Password is required',
  }),
});
