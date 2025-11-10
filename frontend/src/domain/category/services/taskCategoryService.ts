/**
 * @service taskCategoryService
 * @summary Task-Category relationship service for authenticated endpoints
 * @domain category
 * @type rest-service
 * @apiContext internal
 *
 * @description
 * All methods use authenticatedClient which targets:
 * /api/v1/internal/task-category/...
 */

import { authenticatedClient } from '@/core/lib/api';
import type { Task } from '@/domain/task/types';
import type {
  Category,
  AssignTaskCategoryDto,
  TaskCategoryApiResponse,
  TaskCategoryListApiResponse,
} from '../types';

export const taskCategoryService = {
  /**
   * @endpoint POST /api/v1/internal/task-category
   * @summary Assigns category to task
   */
  async assign(data: AssignTaskCategoryDto): Promise<TaskCategoryApiResponse> {
    const response = await authenticatedClient.post<TaskCategoryApiResponse>(
      '/task-category',
      data
    );
    return response.data;
  },

  /**
   * @endpoint DELETE /api/v1/internal/task-category
   * @summary Removes category from task
   */
  async remove(idTask: string, idCategory: string, idUser: string): Promise<void> {
    await authenticatedClient.delete('/task-category', {
      params: { idTask, idCategory, idUser },
    });
  },

  /**
   * @endpoint GET /api/v1/internal/task-category/task/:idTask
   * @summary Gets all categories for a task
   */
  async getTaskCategories(idTask: string, idUser: string): Promise<Category[]> {
    const response = await authenticatedClient.get<TaskCategoryListApiResponse>(
      `/task-category/task/${idTask}`,
      { params: { idUser } }
    );
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/task-category/category/:idCategory
   * @summary Gets all tasks for a category
   */
  async getCategoryTasks(
    idCategory: string,
    idUser: string,
    includeSubcategories: boolean = true
  ): Promise<Task[]> {
    const response = await authenticatedClient.get<{ data: Task[]; success: boolean }>(
      `/task-category/category/${idCategory}`,
      { params: { idUser, includeSubcategories: includeSubcategories.toString() } }
    );
    return response.data.data;
  },
};
