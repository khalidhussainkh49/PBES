import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
//app.use('/api/users', userRoutes);

//catch all routes
app.get('/*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
