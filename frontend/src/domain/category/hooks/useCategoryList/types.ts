/**
 * @types UseCategoryListTypes
 * @summary Type definitions for useCategoryList hook
 */

import type { Category, CategoryListParams } from '../../types';

export interface UseCategoryListOptions {
  params: CategoryListParams;
  enabled?: boolean;
}

export interface UseCategoryListReturn {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
