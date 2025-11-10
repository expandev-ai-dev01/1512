/**
 * @types UseTaskCategoryAssignTypes
 * @summary Type definitions for useTaskCategoryAssign hook
 */

import type { AssignTaskCategoryDto, TaskCategory } from '../../types';

export interface UseTaskCategoryAssignOptions {
  onSuccess?: (taskCategory: TaskCategory) => void;
  onError?: (error: Error) => void;
}

export interface UseTaskCategoryAssignReturn {
  assignCategory: (data: AssignTaskCategoryDto) => Promise<TaskCategory>;
  isAssigning: boolean;
  error: Error | null;
}
