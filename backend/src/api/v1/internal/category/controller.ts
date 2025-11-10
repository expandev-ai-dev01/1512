/**
 * @summary
 * Category management API controller
 *
 * @module api/v1/internal/category
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  categoryCreate,
  categoryList,
  categoryGet,
  categoryUpdate,
  categoryDelete,
} from '@/services/category';
import { successResponse, errorResponse } from '@/utils/response';

/**
 * @api {post} /api/v1/internal/category Create Category
 * @apiName CreateCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new category with name, color and optional description
 *
 * @apiParam {String} idUser User identifier
 * @apiParam {String} name Category name (2-50 characters)
 * @apiParam {String} color Category color (hexadecimal format)
 * @apiParam {String} [description] Category description (max 200 characters)
 * @apiParam {String} [parentCategoryId] Parent category identifier for subcategories
 *
 * @apiSuccess {String} idCategory Category identifier
 * @apiSuccess {String} name Category name
 * @apiSuccess {String} color Category color
 * @apiSuccess {String} description Category description
 * @apiSuccess {Boolean} isDefault Indicates if it's a default category
 * @apiSuccess {String} parentCategoryId Parent category identifier
 * @apiSuccess {Number} order Display order
 * @apiSuccess {Date} dateCreated Creation timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} DuplicateNameError Name already exists for user
 * @apiError {String} MaxCategoriesError User reached maximum categories limit
 * @apiError {String} MaxNestingError Maximum nesting level reached
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @validation Request body validation schema
     */
    const bodySchema = z.object({
      idUser: z.string().uuid(),
      name: z.string().min(2).max(50).trim(),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      description: z.string().max(200).trim().optional().nullable(),
      parentCategoryId: z.string().uuid().optional().nullable(),
    });

    const validatedData = bodySchema.parse(req.body);

    /**
     * @rule {RU-003,RU-004,RU-005} Validate name requirements
     */
    if (validatedData.name.trim().length === 0) {
      res.status(400).json(errorResponse('nameCannotBeOnlyWhitespace', 'VALIDATION_ERROR'));
      return;
    }

    const category = await categoryCreate({
      idUser: validatedData.idUser,
      name: validatedData.name,
      color: validatedData.color,
      description: validatedData.description || null,
      parentCategoryId: validatedData.parentCategoryId || null,
    });

    res.status(201).json(successResponse(category));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('validationFailed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    if (error.message === 'duplicateNameError') {
      res.status(409).json(errorResponse('categoryNameAlreadyExists', 'DUPLICATE_NAME'));
      return;
    }

    if (error.message === 'maxCategoriesError') {
      res.status(400).json(errorResponse('maxCategoriesLimitReached', 'MAX_CATEGORIES'));
      return;
    }

    if (error.message === 'maxNestingError') {
      res.status(400).json(errorResponse('maxNestingLevelReached', 'MAX_NESTING'));
      return;
    }

    if (error.message === 'parentNotFoundError') {
      res.status(404).json(errorResponse('parentCategoryNotFound', 'NOT_FOUND'));
      return;
    }

    next(error);
  }
}

/**
 * @api {get} /api/v1/internal/category List Categories
 * @apiName ListCategories
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves all categories for a specific user
 *
 * @apiParam {String} idUser User identifier (query parameter)
 *
 * @apiSuccess {Array} categories List of categories
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

    const categories = await categoryList(validatedData.idUser);

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
 * @api {get} /api/v1/internal/category/:id Get Category
 * @apiName GetCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a specific category by ID
 *
 * @apiParam {String} id Category identifier (URL parameter)
 * @apiParam {String} idUser User identifier (query parameter)
 *
 * @apiSuccess {Object} category Category entity
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Category not found
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

    const category = await categoryGet(validatedParams.id, validatedQuery.idUser);

    if (!category) {
      res.status(404).json(errorResponse('categoryNotFound', 'NOT_FOUND'));
      return;
    }

    res.json(successResponse(category));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('validationFailed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    next(error);
  }
}

/**
 * @api {put} /api/v1/internal/category/:id Update Category
 * @apiName UpdateCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing category
 *
 * @apiParam {String} id Category identifier (URL parameter)
 * @apiParam {String} idUser User identifier
 * @apiParam {String} [name] Category name (2-50 characters)
 * @apiParam {String} [color] Category color (hexadecimal format)
 * @apiParam {String} [description] Category description (max 200 characters)
 * @apiParam {Number} [order] Display order
 *
 * @apiSuccess {Object} category Updated category entity
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Category not found
 * @apiError {String} DefaultCategoryError Cannot modify default category
 * @apiError {String} ServerError Internal server error
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    /**
     * @validation Path and body parameters validation schema
     */
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      idUser: z.string().uuid(),
      name: z.string().min(2).max(50).trim().optional(),
      color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/)
        .optional(),
      description: z.string().max(200).trim().optional().nullable(),
      order: z.number().int().min(0).optional(),
    });

    const validatedParams = paramsSchema.parse(req.params);
    const validatedData = bodySchema.parse(req.body);

    const category = await categoryUpdate(validatedParams.id, {
      idUser: validatedData.idUser,
      name: validatedData.name,
      color: validatedData.color,
      description: validatedData.description,
      order: validatedData.order,
    });

    res.json(successResponse(category));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('validationFailed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    if (error.message === 'categoryNotFoundError') {
      res.status(404).json(errorResponse('categoryNotFound', 'NOT_FOUND'));
      return;
    }

    if (error.message === 'defaultCategoryError') {
      res.status(400).json(errorResponse('cannotModifyDefaultCategory', 'DEFAULT_CATEGORY'));
      return;
    }

    if (error.message === 'duplicateNameError') {
      res.status(409).json(errorResponse('categoryNameAlreadyExists', 'DUPLICATE_NAME'));
      return;
    }

    next(error);
  }
}

/**
 * @api {delete} /api/v1/internal/category/:id Delete Category
 * @apiName DeleteCategory
 * @apiGroup Category
 * @apiVersion 1.0.0
 *
 * @apiDescription Deletes a category
 *
 * @apiParam {String} id Category identifier (URL parameter)
 * @apiParam {String} idUser User identifier (query parameter)
 * @apiParam {String} [moveToCategory] Target category ID to move tasks to
 *
 * @apiSuccess {Boolean} success Deletion success status
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} NotFoundError Category not found
 * @apiError {String} DefaultCategoryError Cannot delete default category
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
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
      moveToCategory: z.string().uuid().optional(),
    });

    const validatedParams = paramsSchema.parse(req.params);
    const validatedQuery = querySchema.parse(req.query);

    await categoryDelete(
      validatedParams.id,
      validatedQuery.idUser,
      validatedQuery.moveToCategory || null
    );

    res.json(successResponse({ deleted: true }));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json(errorResponse('validationFailed', 'VALIDATION_ERROR', error.errors));
      return;
    }

    if (error.message === 'categoryNotFoundError') {
      res.status(404).json(errorResponse('categoryNotFound', 'NOT_FOUND'));
      return;
    }

    if (error.message === 'defaultCategoryError') {
      res.status(400).json(errorResponse('cannotDeleteDefaultCategory', 'DEFAULT_CATEGORY'));
      return;
    }

    next(error);
  }
}
