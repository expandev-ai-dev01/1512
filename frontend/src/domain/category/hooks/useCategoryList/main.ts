/**
 * @hook useCategoryList
 * @summary Hook for fetching and managing category list
 * @domain category
 * @type domain-hook
 * @category data
 */

import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryListOptions, UseCategoryListReturn } from './types';

export const useCategoryList = (options: UseCategoryListOptions): UseCategoryListReturn => {
  const { params, enabled = true } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['categories', params.idUser],
    queryFn: () => categoryService.list(params),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

  return {
    categories: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
