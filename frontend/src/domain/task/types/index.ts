/**
 * @types TaskTypes
 * @summary Type definitions for task domain
 * @domain task
 */

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum TaskStatus {
  Pending = 0,
  Completed = 1,
}

export interface Task {
  idTask: string;
  idUser: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dateCreated: string;
}

export interface CreateTaskDto {
  idUser: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
}

export interface TaskListParams {
  idUser: string;
}

export interface TaskApiResponse {
  data: Task;
  success: boolean;
  message?: string;
  warning?: string;
}

export interface TaskListApiResponse {
  data: Task[];
  success: boolean;
}
