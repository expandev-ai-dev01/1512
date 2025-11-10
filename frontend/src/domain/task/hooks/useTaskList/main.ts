/**
 * @hook useTaskList
 * @summary Hook for fetching and managing task list
 * @domain task
 * @type domain-hook
 * @category data
 */

import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { UseTaskListOptions, UseTaskListReturn } from './types';

export const useTaskList = (options: UseTaskListOptions): UseTaskListReturn => {
  const { params, enabled = true } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', params.idUser],
    queryFn: () => taskService.list(params),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

  return {
    tasks: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
