import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

//catch all routes
app.get('/*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
