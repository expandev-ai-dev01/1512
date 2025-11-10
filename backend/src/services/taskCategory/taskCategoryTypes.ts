/**
 * @summary
 * Type definitions for task-category relationship operations
 *
 * @module services/taskCategory
 */

/**
 * Task-Category relationship entity
 */
export interface TaskCategoryEntity {
  idTaskCategory: string;
  idTask: string;
  idCategory: string;
  dateCreated: Date;
}

/**
 * Task-Category assignment request parameters
 */
export interface TaskCategoryAssignRequest {
  idUser: string;
  idTask: string;
  idCategory: string;
}

/**
 * Task with categories information
 */
export interface TaskWithCategories {
  idTask: string;
  title: string;
  categories: string[];
}
