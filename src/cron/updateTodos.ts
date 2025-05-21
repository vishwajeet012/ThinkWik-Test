import schedule from 'node-schedule';
import Todo from '../models/todo';

const updateExpiredTodos = (): void => {
  schedule.scheduleJob('0 0 * * *', async () => {
    try {
      const now = new Date();
      await Todo.updateMany(
        { dueDate: { $lt: now }, completed: false },
        { $set: { completed: true } }
      );
      console.log('CRON job completed: Expired todos marked as done.');
    } catch (error) {
      console.error('CRON job error:', error);
    }
  });
};

export default updateExpiredTodos;