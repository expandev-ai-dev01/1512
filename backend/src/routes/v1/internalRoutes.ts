import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';

const router = Router();

// Task routes
router.post('/task', taskController.postHandler);
router.get('/task', taskController.getHandler);
router.get('/task/:id', taskController.getByIdHandler);

export default router;
