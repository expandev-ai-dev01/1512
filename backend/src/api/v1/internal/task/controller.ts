/**
 * @summary
 * Task management API controller
 *
 * @module api/v1/internal/task
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { taskCreate, taskList, taskGet, TaskPriority } from '@/services/task';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with title, description, due date and priority
 *
 * @apiParam {String} idUser User identifier
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 500 characters)
 * @apiParam {Date} [dueDate] Task due date (format: YYYY-MM-DD)
 * @apiParam {Number} [priority] Task priority (0=Low, 1=Medium, 2=High)
 *
 * @apiSuccess {String} idTask Task identifier
 * @apiSuccess {String} title Task title
 * @apiSuccess {String} description Task description
 * @apiSuccess {Date} dueDate Task due date
 * @apiSuccess {Number} priority Task priority
 * @apiSuccess {Number} status Task status
 * @apiSuccess {Date} dateCreated Creation timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} DuplicateTitleError Title already exists for user
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @validation Request body validation schema
     */
    const bodySchema = z.object({
      idUser: z.string().uuid(),
      title: z.string().min(3).max(100).trim(),
      description: z.string().max(500).trim().optional().nullable(),
      dueDate: z.string().datetime().optional().nullable(),
      priority: z.nativeEnum(TaskPriority).optional(),
    });

    const validatedData = bodySchema.parse(req.body);

    /**
     * @rule {RU-006} Validate due date is not in the past
     */
    let dueDateWarning = false;
    let parsedDueDate: Date | null = null;

    if (validatedData.dueDate) {
      parsedDueDate = new Date(validatedData.dueDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      parsedDueDate.setHours(0, 0, 0, 0);

      if (parsedDueDate < now) {
        dueDateWarning = true;
      }
    }

    /**
     * @rule {RU-003} Validate title is not only whitespace
     */
    if (validatedData.title.trim().length === 0) {
      res.status(400).json(errorResponse('titleCannotBeOnlyWhitespace', 'VALIDATION_ERROR'));
      return;
    }

    const task = await taskCreate({
      idUser: validatedData.idUser,
      title: validatedData.title,
      description: validatedData.description || null,
      dueDate: parsedDueDate,
      priority: validatedData.priority,
    });

    const response = successResponse(task, {
      ...(dueDateWarning && { warning: 'dueDateInPast' }),
    });

    res.status(201).json(response);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('validationFailed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    if (error.message === 'duplicateTitleError') {
      res.status(409).json(errorResponse('titleAlreadyExists', 'DUPLICATE_TITLE'));
      return;
    }

    next(error);
  }
}

/**
 * @api {get} /api/v1/internal/task List Tasks
 * @apiName ListTasks
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves all tasks for a specific user
 *
 * @apiParam {String} idUser User identifier (query parameter)
 *
 * @apiSuccess {Array} tasks List of tasks
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @validation Query parameters validation schema
     */
    const querySchema = z.object({
      idUser: z.string().uuid(),
    });

    const validatedData = querySchema.parse(req.query);

    const tasks = await taskList(validatedData.idUser);

    res.json(successResponse(tasks));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('validationFailed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    next(error);
  }
}

/**
 * @api {get} /api/v1/internal/task/:id Get Task
 * @apiName GetTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a specific task by ID
 *
 * @apiParam {String} id Task identifier (URL parameter)
 * @apiParam {String} idUser User identifier (query parameter)
 *
 * @apiSuccess {Object} task Task entity
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Task not found
 * @apiError {String} ServerError Internal server error
 */
export async function getByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    /**
     * @validation Path and query parameters validation schema
     */
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const querySchema = z.object({
      idUser: z.string().uuid(),
    });

    const validatedParams = paramsSchema.parse(req.params);
    const validatedQuery = querySchema.parse(req.query);

    const task = await taskGet(validatedParams.id, validatedQuery.idUser);

    if (!task) {
      res.status(404).json(errorResponse('taskNotFound', 'NOT_FOUND'));
      return;
    }

    res.json(successResponse(task));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('validationFailed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    next(error);
  }
}
