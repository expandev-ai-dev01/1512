/**
 * @types TaskFormTypes
 * @summary Type definitions for TaskForm component
 */

import type { TaskPriority } from '../../types';

export interface TaskFormProps {
  onSuccess?: (taskId: string, warning?: string) => void;
  onCancel?: () => void;
  userId: string;
  quickMode?: boolean;
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
}
