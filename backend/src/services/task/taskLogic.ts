/**
 * @summary
 * Business logic for task management operations
 *
 * @module services/task
 */

import { TaskCreateRequest, TaskCreateResponse, TaskPriority, TaskStatus } from './taskTypes';
import { v4 as uuidv4 } from 'uuid';

/**
 * In-memory task storage
 */
const tasks: Map<string, TaskCreateResponse> = new Map();

/**
 * @summary
 * Creates a new task with validation and default values
 *
 * @function taskCreate
 * @module services/task
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 * @param {string} params.idUser - User identifier
 * @param {string} params.title - Task title
 * @param {string} [params.description] - Task description
 * @param {Date} [params.dueDate] - Task due date
 * @param {TaskPriority} [params.priority] - Task priority
 *
 * @returns {Promise<TaskCreateResponse>} Created task entity
 *
 * @throws {Error} When title is duplicated for the user
 * @throws {Error} When validation fails
 */
export async function taskCreate(params: TaskCreateRequest): Promise<TaskCreateResponse> {
  /**
   * @validation Check for duplicate title for the same user
   * @throw {duplicateTitleError}
   */
  const existingTask = Array.from(tasks.values()).find(
    (task) => task.title === params.title && task.idUser === params.idUser
  );

  if (existingTask) {
    throw new Error('duplicateTitleError');
  }

  /**
   * @rule {BR-004} Apply default priority (medium) when not specified
   */
  const priority = params.priority !== undefined ? params.priority : TaskPriority.Medium;

  /**
   * @rule {RU-011} Generate unique task identifier
   */
  const idTask = uuidv4();

  /**
   * @rule {RU-009} Generate creation timestamp
   */
  const dateCreated = new Date();

  /**
   * @rule {RU-008} Set initial status as pending
   */
  const status = TaskStatus.Pending;

  const newTask: TaskCreateResponse = {
    idTask,
    idUser: params.idUser,
    title: params.title,
    description: params.description || null,
    dueDate: params.dueDate || null,
    priority,
    status,
    dateCreated,
  };

  tasks.set(idTask, newTask);

  return newTask;
}

/**
 * @summary
 * Retrieves all tasks for a specific user
 *
 * @function taskList
 * @module services/task
 *
 * @param {string} idUser - User identifier
 *
 * @returns {Promise<TaskCreateResponse[]>} List of user tasks
 */
export async function taskList(idUser: string): Promise<TaskCreateResponse[]> {
  return Array.from(tasks.values()).filter((task) => task.idUser === idUser);
}

/**
 * @summary
 * Retrieves a specific task by ID
 *
 * @function taskGet
 * @module services/task
 *
 * @param {string} idTask - Task identifier
 * @param {string} idUser - User identifier
 *
 * @returns {Promise<TaskCreateResponse | null>} Task entity or null if not found
 */
export async function taskGet(idTask: string, idUser: string): Promise<TaskCreateResponse | null> {
  const task = tasks.get(idTask);

  if (!task || task.idUser !== idUser) {
    return null;
  }

  return task;
}
