/**
 * @service taskService
 * @summary Task management service for authenticated endpoints
 * @domain task
 * @type rest-service
 * @apiContext internal
 *
 * @description
 * All methods use authenticatedClient which targets:
 * /api/v1/internal/task/...
 */

import { authenticatedClient } from '@/core/lib/api';
import type {
  Task,
  CreateTaskDto,
  TaskListParams,
  TaskApiResponse,
  TaskListApiResponse,
} from '../types';

export const taskService = {
  /**
   * @endpoint POST /api/v1/internal/task
   * @summary Creates new task
   */
  async create(data: CreateTaskDto): Promise<TaskApiResponse> {
    const response = await authenticatedClient.post<TaskApiResponse>('/task', data);
    return response.data;
  },

  /**
   * @endpoint GET /api/v1/internal/task
   * @summary Fetches list of tasks with filters
   */
  async list(params: TaskListParams): Promise<Task[]> {
    const response = await authenticatedClient.get<TaskListApiResponse>('/task', { params });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/task/:id
   * @summary Fetches single task by ID
   */
  async getById(id: string, idUser: string): Promise<Task> {
    const response = await authenticatedClient.get<TaskApiResponse>(`/task/${id}`, {
      params: { idUser },
    });
    return response.data.data;
  },
};
