/**
 * @service categoryService
 * @summary Category management service for authenticated endpoints
 * @domain category
 * @type rest-service
 * @apiContext internal
 *
 * @description
 * All methods use authenticatedClient which targets:
 * /api/v1/internal/category/...
 */

import { authenticatedClient } from '@/core/lib/api';
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryListParams,
  CategoryApiResponse,
  CategoryListApiResponse,
} from '../types';

export const categoryService = {
  /**
   * @endpoint POST /api/v1/internal/category
   * @summary Creates new category
   */
  async create(data: CreateCategoryDto): Promise<CategoryApiResponse> {
    const response = await authenticatedClient.post<CategoryApiResponse>('/category', data);
    return response.data;
  },

  /**
   * @endpoint GET /api/v1/internal/category
   * @summary Fetches list of categories
   */
  async list(params: CategoryListParams): Promise<Category[]> {
    const response = await authenticatedClient.get<CategoryListApiResponse>('/category', {
      params,
    });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/category/:id
   * @summary Fetches single category by ID
   */
  async getById(id: string, idUser: string): Promise<Category> {
    const response = await authenticatedClient.get<CategoryApiResponse>(`/category/${id}`, {
      params: { idUser },
    });
    return response.data.data;
  },

  /**
   * @endpoint PUT /api/v1/internal/category/:id
   * @summary Updates existing category
   */
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response = await authenticatedClient.put<CategoryApiResponse>(`/category/${id}`, data);
    return response.data.data;
  },

  /**
   * @endpoint DELETE /api/v1/internal/category/:id
   * @summary Deletes category
   */
  async delete(id: string, idUser: string, moveToCategory?: string): Promise<void> {
    await authenticatedClient.delete(`/category/${id}`, {
      params: { idUser, moveToCategory },
    });
  },
};
