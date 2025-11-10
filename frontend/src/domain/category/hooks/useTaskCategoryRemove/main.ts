/**
 * @hook useTaskCategoryRemove
 * @summary Hook for removing categories from tasks
 * @domain category
 * @type domain-hook
 * @category data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskCategoryService } from '../../services/taskCategoryService';
import type { UseTaskCategoryRemoveOptions, UseTaskCategoryRemoveReturn } from './types';

export const useTaskCategoryRemove = (
  options: UseTaskCategoryRemoveOptions = {}
): UseTaskCategoryRemoveReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      idTask,
      idCategory,
      idUser,
    }: {
      idTask: string;
      idCategory: string;
      idUser: string;
    }) => taskCategoryService.remove(idTask, idCategory, idUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-categories'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    removeCategory: async (idTask: string, idCategory: string, idUser: string) => {
      await mutation.mutateAsync({ idTask, idCategory, idUser });
    },
    isRemoving: mutation.isPending,
    error: mutation.error,
  };
};
