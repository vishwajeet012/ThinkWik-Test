import { Request, Response } from 'express';
import { z } from 'zod';
import Todo, { ITodo } from '../models/todo';

interface AuthRequest extends Request {
  user?: { id: string };
}

// Validation schemas
const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }).optional(),
  completed: z.boolean().optional(),
});

export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate } = createTodoSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const todo = new Todo({
      title,
      description,
      dueDate: new Date(dueDate),
      user: userId,
    });

    await todo.save();
    res.status(201).json({ data: todo });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const todos = await Todo.find({ user: userId });
    res.json({ data: todos });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTodoById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    if (todo.user.toString() !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    res.json({ data: todo });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    if (todo.user.toString() !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const { title, description, dueDate, completed } = updateTodoSchema.parse(req.body);
    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.dueDate = dueDate ? new Date(dueDate) : todo.dueDate;
    todo.completed = completed !== undefined ? completed : todo.completed;

    await todo.save();
    res.json({ data: todo });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    if (todo.user.toString() !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await todo.deleteOne();
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};