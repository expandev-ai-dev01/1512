/**
 * @summary
 * Task-Category relationship management API controller
 *
 * @module api/v1/internal/task-category
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  taskCategoryAssign,
  taskCategoryRemove,
  taskCategoryList,
  tasksByCategory,
} from '@/services/taskCategory';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {post} /api/v1/internal/task-category Assign Category to Task
 * @apiName AssignTaskCategory
 * @apiGroup TaskCategory
 * @apiVersion 1.0.0
 *
 * @apiDescription Assigns a category to a task
 *
 * @apiParam {String} idUser User identifier
 * @apiParam {String} idTask Task identifier
 * @apiParam {String} idCategory Category identifier
 *
 * @apiSuccess {Object} taskCategory Task-category relationship
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} MaxCategoriesError Task reached maximum categories limit
 * @apiError {String} AlreadyAssignedError Category already assigned to task
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @validation Request body validation schema
     */
    const bodySchema = z.object({
      idUser: z.string().uuid(),
      idTask: z.string().uuid(),
      idCategory: z.string().uuid(),
    });

    const validatedData = bodySchema.parse(req.body);

    const taskCategory = await taskCategoryAssign({
      idUser: validatedData.idUser,
      idTask: validatedData.idTask,
      idCategory: validatedData.idCategory,
    });

    res.status(201).json(successResponse(taskCategory));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('validationFailed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    if (error.message === 'maxCategoriesError') {
      res.status(400).json(errorResponse('taskMaxCategoriesReached', 'MAX_CATEGORIES'));
      return;
    }

    if (error.message === 'alreadyAssignedError') {
      res.status(409).json(errorResponse('categoryAlreadyAssigned', 'ALREADY_ASSIGNED'));
      return;
    }

    if (error.message === 'taskNotFoundError') {
      res.status(404).json(errorResponse('taskNotFound', 'NOT_FOUND'));
      return;
    }

    if (error.message === 'categoryNotFoundError') {
      res.status(404).json(errorResponse('categoryNotFound', 'NOT_FOUND'));
      return;
    }

    next(error);
  }
}

/**
 * @api {delete} /api/v1/internal/task-category Remove Category from Task
 * @apiName RemoveTaskCategory
 * @apiGroup TaskCategory
 * @apiVersion 1.0.0
 *
 * @apiDescription Removes a category from a task
 *
 * @apiParam {String} idUser User identifier (query parameter)
 * @apiParam {String} idTask Task identifier (query parameter)
 * @apiParam {String} idCategory Category identifier (query parameter)
 *
 * @apiSuccess {Boolean} success Removal success status
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Relationship not found
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    /**
     * @validation Query parameters validation schema
     */
    const querySchema = z.object({
      idUser: z.string().uuid(),
      idTask: z.string().uuid(),
      idCategory: z.string().uuid(),
    });

    const validatedData = querySchema.parse(req.query);

    await taskCategoryRemove(validatedData.idTask, validatedData.idCategory, validatedData.idUser);

    res.json(successResponse({ removed: true }));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('validationFailed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    if (error.message === 'relationshipNotFoundError') {
      res.status(404).json(errorResponse('taskCategoryNotFound', 'NOT_FOUND'));
      return;
    }

    next(error);
  }
}

/**
 * @api {get} /api/v1/internal/task-category/task/:idTask Get Task Categories
 * @apiName GetTaskCategories
 * @apiGroup TaskCategory
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves all categories assigned to a task
 *
 * @apiParam {String} idTask Task identifier (URL parameter)
 * @apiParam {String} idUser User identifier (query parameter)
 *
 * @apiSuccess {Array} categories List of categories
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function getTaskCategoriesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    /**
     * @validation Path and query parameters validation schema
     */
    const paramsSchema = z.object({
      idTask: z.string().uuid(),
    });

    const querySchema = z.object({
      idUser: z.string().uuid(),
    });

    const validatedParams = paramsSchema.parse(req.params);
    const validatedQuery = querySchema.parse(req.query);

    const categories = await taskCategoryList(validatedParams.idTask, validatedQuery.idUser);

    res.json(successResponse(categories));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('validationFailed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    next(error);
  }
}

/**
 * @api {get} /api/v1/internal/task-category/category/:idCategory Get Category Tasks
 * @apiName GetCategoryTasks
 * @apiGroup TaskCategory
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves all tasks assigned to a category
 *
 * @apiParam {String} idCategory Category identifier (URL parameter)
 * @apiParam {String} idUser User identifier (query parameter)
 * @apiParam {Boolean} [includeSubcategories] Include subcategories (query parameter)
 *
 * @apiSuccess {Array} tasks List of tasks
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function getCategoryTasksHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    /**
     * @validation Path and query parameters validation schema
     */
    const paramsSchema = z.object({
      idCategory: z.string().uuid(),
    });

    const querySchema = z.object({
      idUser: z.string().uuid(),
      includeSubcategories: z.string().optional(),
    });

    const validatedParams = paramsSchema.parse(req.params);
    const validatedQuery = querySchema.parse(req.query);

    const includeSubcategories = validatedQuery.includeSubcategories === 'true';

    const tasks = await tasksByCategory(
      validatedParams.idCategory,
      validatedQuery.idUser,
      includeSubcategories
    );

    res.json(successResponse(tasks));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('validationFailed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    next(error);
  }
}
