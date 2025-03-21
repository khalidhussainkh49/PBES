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
  loggedInUserRole
) => {
  // Check if all fields are provided
  if (!serviceNumber || !name || !email || !password || !role) {
    throw new ErrorWithStatus('All fields are required', 400);
  }

  // Role-based validation
  if (loggedInUserRole === 'Officer') {
    throw new ErrorWithStatus('Officers cannot create users', 403);
  }

  // Prevent creation of SuperAdmin from the frontend
  if (role === 'SuperAdmin') {
    throw new ErrorWithStatus(
      'SuperAdmin can only be created from the backend',
      403
    );
  }

  // Ensure the role being created is either Admin or Officer
  if (role !== 'Admin' && role !== 'Officer') {
    throw new ErrorWithStatus(
      'Invalid role. Only Admins and Officers can be created',
      400
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ serviceNumber }, { email }],
  });
  if (existingUser) {
    throw new ErrorWithStatus('User already exists', 400);
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
  return {
    message: 'User created successfully',
    data: {
      id: newUser._id,
      serviceNumber: newUser.serviceNumber,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      updateAt: newUser.updatedAt,
      createAt: newUser.createdAt,
    },
  };
};

export const loginUser = async (serviceNumber, password) => {
  const user = await User.findOne({ serviceNumber });
  if (!user) {
    throw new ErrorWithStatus('User not found', 404);
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
    message: 'Login successful',
    data: {
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        serviceNumber: user.serviceNumber,
        role: user.role,
        email: user.email,
        updateAt: user.updatedAt,
        createAt: user.createdAt,
      },
    },
  };
};
