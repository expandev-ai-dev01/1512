/**
 * @hook useCategoryDelete
 * @summary Hook for deleting categories
 * @domain category
 * @type domain-hook
 * @category data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import type { UseCategoryDeleteOptions, UseCategoryDeleteReturn } from './types';

export const useCategoryDelete = (
  options: UseCategoryDeleteOptions = {}
): UseCategoryDeleteReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      idUser,
      moveToCategory,
    }: {
      id: string;
      idUser: string;
      moveToCategory?: string;
    }) => categoryService.delete(id, idUser, moveToCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    deleteCategory: async (id: string, idUser: string, moveToCategory?: string) => {
      await mutation.mutateAsync({ id, idUser, moveToCategory });
    },
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
};
