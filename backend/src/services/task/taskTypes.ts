/**
 * @summary
 * Type definitions for task management operations
 *
 * @module services/task
 */

/**
 * Task priority levels
 */
export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

/**
 * Task status values
 */
export enum TaskStatus {
  Pending = 0,
  Completed = 1,
}

/**
 * Task entity interface
 */
export interface TaskEntity {
  idTask: string;
  idUser: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  dateCreated: Date;
}

/**
 * Task creation request parameters
 */
export interface TaskCreateRequest {
  idUser: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority?: TaskPriority;
}

/**
 * Task creation response
 */
export interface TaskCreateResponse {
  idTask: string;
  idUser: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
  dateCreated: Date;
}
