/**
 * @summary
 * Business logic for task-category relationship operations
 *
 * @module services/taskCategory
 */

import {
  TaskCategoryAssignRequest,
  TaskCategoryEntity,
  TaskWithCategories,
} from './taskCategoryTypes';
import { categoryGet } from '@/services/category';
import { taskGet } from '@/services/task';
import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory task-category relationship storage
 */
const taskCategories: Map<string, TaskCategoryEntity> = new Map();

/**
 * Maximum categories per task
 */
const MAX_CATEGORIES_PER_TASK = 10;

/**
 * @summary
 * Assigns a category to a task
 *
 * @function taskCategoryAssign
 * @module services/taskCategory
 *
 * @param {TaskCategoryAssignRequest} params - Assignment parameters
 * @param {string} params.idUser - User identifier
 * @param {string} params.idTask - Task identifier
 * @param {string} params.idCategory - Category identifier
 *
 * @returns {Promise<TaskCategoryEntity>} Created task-category relationship
 *
 * @throws {Error} When task is not found
 * @throws {Error} When category is not found
 * @throws {Error} When maximum categories limit is reached
 * @throws {Error} When category is already assigned
 */
export async function taskCategoryAssign(
  params: TaskCategoryAssignRequest
): Promise<TaskCategoryEntity> {
  /**
   * @validation Verify task exists and belongs to user
   * @throw {taskNotFoundError}
   */
  const task = await taskGet(params.idTask, params.idUser);
  if (!task) {
    throw new Error('taskNotFoundError');
  }

  /**
   * @validation Verify category exists and belongs to user
   * @throw {categoryNotFoundError}
   */
  const category = await categoryGet(params.idCategory, params.idUser);
  if (!category) {
    throw new Error('categoryNotFoundError');
  }

  /**
   * @validation Check if category is already assigned to task
   * @throw {alreadyAssignedError}
   */
  const existingRelationship = Array.from(taskCategories.values()).find(
    (tc) => tc.idTask === params.idTask && tc.idCategory === params.idCategory
  );

  if (existingRelationship) {
    throw new Error('alreadyAssignedError');
  }

  /**
   * @validation Check maximum categories per task limit
   * @throw {maxCategoriesError}
   */
  const taskCategoryCount = Array.from(taskCategories.values()).filter(
    (tc) => tc.idTask === params.idTask
  ).length;

  if (taskCategoryCount >= MAX_CATEGORIES_PER_TASK) {
    throw new Error('maxCategoriesError');
  }

  /**
   * @rule {RU-018,RU-019,RU-020} Create task-category relationship
   */
  const idTaskCategory = uuidv4();
  const dateCreated = new Date();

  const taskCategory: TaskCategoryEntity = {
    idTaskCategory,
    idTask: params.idTask,
    idCategory: params.idCategory,
    dateCreated,
  };

  taskCategories.set(idTaskCategory, taskCategory);

  return taskCategory;
}

/**
 * @summary
 * Removes a category from a task
 *
 * @function taskCategoryRemove
 * @module services/taskCategory
 *
 * @param {string} idTask - Task identifier
 * @param {string} idCategory - Category identifier
 * @param {string} idUser - User identifier
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} When relationship is not found
 */
export async function taskCategoryRemove(
  idTask: string,
  idCategory: string,
  idUser: string
): Promise<void> {
  /**
   * @validation Verify task exists and belongs to user
   */
  const task = await taskGet(idTask, idUser);
  if (!task) {
    throw new Error('taskNotFoundError');
  }

  /**
   * @validation Find and remove relationship
   * @throw {relationshipNotFoundError}
   */
  const relationship = Array.from(taskCategories.entries()).find(
    ([, tc]) => tc.idTask === idTask && tc.idCategory === idCategory
  );

  if (!relationship) {
    throw new Error('relationshipNotFoundError');
  }

  taskCategories.delete(relationship[0]);
}

/**
 * @summary
 * Retrieves all categories assigned to a task
 *
 * @function taskCategoryList
 * @module services/taskCategory
 *
 * @param {string} idTask - Task identifier
 * @param {string} idUser - User identifier
 *
 * @returns {Promise<string[]>} List of category IDs
 */
export async function taskCategoryList(idTask: string, idUser: string): Promise<string[]> {
  /**
   * @validation Verify task exists and belongs to user
   */
  const task = await taskGet(idTask, idUser);
  if (!task) {
    return [];
  }

  return Array.from(taskCategories.values())
    .filter((tc) => tc.idTask === idTask)
    .map((tc) => tc.idCategory);
}

/**
 * @summary
 * Retrieves all tasks assigned to a category
 *
 * @function tasksByCategory
 * @module services/taskCategory
 *
 * @param {string} idCategory - Category identifier
 * @param {string} idUser - User identifier
 * @param {boolean} includeSubcategories - Include subcategories
 *
 * @returns {Promise<string[]>} List of task IDs
 */
export async function tasksByCategory(
  idCategory: string,
  idUser: string,
  includeSubcategories: boolean = true
): Promise<string[]> {
  /**
   * @validation Verify category exists and belongs to user
   */
  const category = await categoryGet(idCategory, idUser);
  if (!category) {
    return [];
  }

  let categoryIds = [idCategory];

  /**
   * @rule {RU-025} Include subcategories if requested
   */
  if (includeSubcategories) {
    const { categoryList } = await import('@/services/category');
    const allCategories = await categoryList(idUser);
    const subcategories = allCategories.filter((cat) => cat.parentCategoryId === idCategory);
    categoryIds = [...categoryIds, ...subcategories.map((cat) => cat.idCategory)];
  }

  return Array.from(taskCategories.values())
    .filter((tc) => categoryIds.includes(tc.idCategory))
    .map((tc) => tc.idTask);
}

/**
 * @summary
 * Moves tasks from one category to another
 *
 * @function moveTasksToCategory
 * @module services/taskCategory
 *
 * @param {string} fromCategoryId - Source category identifier
 * @param {string} toCategoryId - Target category identifier
 * @param {string} idUser - User identifier
 *
 * @returns {Promise<void>}
 */
export async function moveTasksToCategory(
  fromCategoryId: string,
  toCategoryId: string | null,
  idUser: string
): Promise<void> {
  const relationships = Array.from(taskCategories.entries()).filter(
    ([, tc]) => tc.idCategory === fromCategoryId
  );

  for (const [idTaskCategory, relationship] of relationships) {
    if (toCategoryId) {
      const updatedRelationship: TaskCategoryEntity = {
        ...relationship,
        idCategory: toCategoryId,
      };
      taskCategories.set(idTaskCategory, updatedRelationship);
    } else {
      taskCategories.delete(idTaskCategory);
    }
  }
}
