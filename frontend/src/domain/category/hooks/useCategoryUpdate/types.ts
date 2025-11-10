/**
 * @types UseCategoryUpdateTypes
 * @summary Type definitions for useCategoryUpdate hook
 */

import type { UpdateCategoryDto, Category } from '../../types';

export interface UseCategoryUpdateOptions {
  onSuccess?: (category: Category) => void;
  onError?: (error: Error) => void;
}

export interface UseCategoryUpdateReturn {
  updateCategory: (id: string, data: UpdateCategoryDto) => Promise<Category>;
  isUpdating: boolean;
  error: Error | null;
}
