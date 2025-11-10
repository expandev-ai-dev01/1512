import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';
import * as categoryController from '@/api/v1/internal/category/controller';
import * as taskCategoryController from '@/api/v1/internal/task-category/controller';

const router = Router();

// Task routes
router.post('/task', taskController.postHandler);
router.get('/task', taskController.getHandler);
router.get('/task/:id', taskController.getByIdHandler);

// Category routes
router.post('/category', categoryController.postHandler);
router.get('/category', categoryController.getHandler);
router.get('/category/:id', categoryController.getByIdHandler);
router.put('/category/:id', categoryController.putHandler);
router.delete('/category/:id', categoryController.deleteHandler);

// Task-Category relationship routes
router.post('/task-category', taskCategoryController.postHandler);
router.delete('/task-category', taskCategoryController.deleteHandler);
router.get('/task-category/task/:idTask', taskCategoryController.getTaskCategoriesHandler);
router.get('/task-category/category/:idCategory', taskCategoryController.getCategoryTasksHandler);

export default router;
