/**
 * @hook useTaskCreate
 * @summary Hook for creating tasks with validation and feedback
 * @domain task
 * @type domain-hook
 * @category data
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { UseTaskCreateOptions, UseTaskCreateReturn } from './types';
import type { CreateTaskDto } from '../../types';

export const useTaskCreate = (options: UseTaskCreateOptions = {}): UseTaskCreateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateTaskDto) => taskService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.(response.data, response.warning);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    createTask: async (data: CreateTaskDto) => {
      const response = await mutation.mutateAsync(data);
      return response.data;
    },
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
