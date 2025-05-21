import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import todoRoutes from './routes/todo';
import updateExpiredTodos from './cron/updateTodos';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Start CRON job
updateExpiredTodos();

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Todo List API');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});