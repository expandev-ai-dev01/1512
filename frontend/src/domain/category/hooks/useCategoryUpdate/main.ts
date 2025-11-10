/**
 * @hook useCategoryUpdate
 * @summary Hook for updating categories
 * @domain category
 * @type domain-hook
 * @category data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryUpdateOptions, UseCategoryUpdateReturn } from './types';
import type { UpdateCategoryDto } from '../../types';

export const useCategoryUpdate = (
  options: UseCategoryUpdateOptions = {}
): UseCategoryUpdateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoryService.update(id, data),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.(category);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    updateCategory: async (id: string, data: UpdateCategoryDto) => {
      return await mutation.mutateAsync({ id, data });
    },
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
