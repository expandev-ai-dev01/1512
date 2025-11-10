/**
 * @hook useTaskCategoryAssign
 * @summary Hook for assigning categories to tasks
 * @domain category
 * @type domain-hook
 * @category data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskCategoryService } from '../../services/taskCategoryService';
import type { UseTaskCategoryAssignOptions, UseTaskCategoryAssignReturn } from './types';
import type { AssignTaskCategoryDto } from '../../types';

export const useTaskCategoryAssign = (
  options: UseTaskCategoryAssignOptions = {}
): UseTaskCategoryAssignReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: AssignTaskCategoryDto) => taskCategoryService.assign(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['task-categories'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.(response.data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    assignCategory: async (data: AssignTaskCategoryDto) => {
      const response = await mutation.mutateAsync(data);
      return response.data;
    },
    isAssigning: mutation.isPending,
    error: mutation.error,
  };
};
