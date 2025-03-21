import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/Schema/user.Schema.js';
import { ErrorWithStatus } from '../Exception/error-with-status.exception.js';

export const registerUser = async (
  serviceNumber,
  name,
  email,
  password,
  role,
  loggedInUserRole // Add this parameter to check the role of the logged-in user
) => {
  // Check if all fields are provided
  if (!serviceNumber || !name || !email || !password || !role) {
    throw new ErrorWithStatus('All fields are required', 400);
  }

  // Role-based validation
  if (loggedInUserRole === 'Officer') {
    throw new ErrorWithStatus('Officers cannot create users', 403);
  }

  // Ensure the role being created is either Admin or Officer
  if (role !== 'Admin' && role !== 'Officer') {
    throw new ErrorWithStatus(
      'Invalid role. Only Admins and Officers can be created',
      400
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    serviceNumber,
    name,
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();
  delete newUser.password;
  return {
    message: 'User created successfully',
    data: {
      user: newUser,
    },
  };
};

export const loginUser = async (serviceNumber, password) => {
  const user = await User.findOne({ serviceNumber });
  if (!user) {
    throw new Error('User not found', 404);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ErrorWithStatus('Username or Password is invalid', 400);
  }
  const JWT_SECRET = process.env.JWT_SECRET || 'secret';
  // Generate JWT token
  const token = jwt.sign(
    { role: user.role, email: user.email, id: user._id },
    JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return {
    message: 'Login sucessful',
    data: {
      acessToken: token,
    },
  };
};
