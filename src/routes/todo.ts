import express from 'express';
import { createTodo, getTodos, getTodoById, updateTodo, deleteTodo } from '../controllers/todoController';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/', auth, createTodo);
router.get('/', auth, getTodos);
router.get('/:id', auth, getTodoById);
router.put('/:id', auth, updateTodo);
router.delete('/:id', auth, deleteTodo);

export default router;