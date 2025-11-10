/**
 * @types CategoryTypes
 * @summary Type definitions for category domain
 * @domain category
 */

export interface Category {
  idCategory: string;
  idUser: string;
  name: string;
  color: string;
  description: string | null;
  isDefault: boolean;
  parentCategoryId: string | null;
  order: number;
  dateCreated: string;
  dateUpdated: string;
}

export interface CreateCategoryDto {
  idUser: string;
  name: string;
  color: string;
  description?: string | null;
  parentCategoryId?: string | null;
}

export interface UpdateCategoryDto {
  idUser: string;
  name?: string;
  color?: string;
  description?: string | null;
  order?: number;
}

export interface CategoryListParams {
  idUser: string;
}

export interface CategoryApiResponse {
  data: Category;
  success: boolean;
  message?: string;
}

export interface CategoryListApiResponse {
  data: Category[];
  success: boolean;
}

export interface TaskCategory {
  idTask: string;
  idCategory: string;
  dateCreated: string;
}

export interface AssignTaskCategoryDto {
  idUser: string;
  idTask: string;
  idCategory: string;
}

export interface TaskCategoryApiResponse {
  data: TaskCategory;
  success: boolean;
  message?: string;
}

export interface TaskCategoryListApiResponse {
  data: Category[];
  success: boolean;
}
