/**
 * @types UseCategoryCreateTypes
 * @summary Type definitions for useCategoryCreate hook
 */

import type { CreateCategoryDto, Category } from '../../types';

export interface UseCategoryCreateOptions {
  onSuccess?: (category: Category) => void;
  onError?: (error: Error) => void;
}

export interface UseCategoryCreateReturn {
  createCategory: (data: CreateCategoryDto) => Promise<Category>;
  isCreating: boolean;
  error: Error | null;
}
