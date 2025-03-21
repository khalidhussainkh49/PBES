import { Router } from 'express';
import * as authController from '../controllers/auth.controllers.js';
import { generateMiddleWare } from '../middleware/route.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { loginSchema, registerSchema } from '../validation/auth.validation.js';

const authRoute = Router();
authRoute.post(
  '/register',
  authMiddleware, // Ensure only logged-in users can access this endpoint
  generateMiddleWare(registerSchema),
  authController.registerUser
);
authRoute.post(
  '/login',
  generateMiddleWare(loginSchema),
  authController.loginUser
);

export default authRoute;
