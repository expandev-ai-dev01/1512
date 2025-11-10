/**
 * @hook useCategoryCreate
 * @summary Hook for creating categories with validation and feedback
 * @domain category
 * @type domain-hook
 * @category data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryCreateOptions, UseCategoryCreateReturn } from './types';
import type { CreateCategoryDto } from '../../types';

export const useCategoryCreate = (
  options: UseCategoryCreateOptions = {}
): UseCategoryCreateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.(response.data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    createCategory: async (data: CreateCategoryDto) => {
      const response = await mutation.mutateAsync(data);
      return response.data;
    },
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
