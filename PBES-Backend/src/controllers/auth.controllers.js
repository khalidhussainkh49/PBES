import * as authService from '../services/auth.services.js';

export const registerUser = async (req, res) => {
  try {
    const { serviceNumber, name, email, password, role } = req.body;
    const loggedInUserRole = req.user.role; // Get the role of the logged-in user
    const result = await authService.registerUser(
      serviceNumber,
      name,
      email,
      password,
      role,
      loggedInUserRole // Pass the logged-in user's role
    );
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { serviceNumber, password } = req.body;
    const result = await authService.loginUser(serviceNumber, password);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};
