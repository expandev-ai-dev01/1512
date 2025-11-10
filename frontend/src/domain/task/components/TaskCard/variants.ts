/**
 * @variants TaskCardVariants
 * @summary Style variants for TaskCard component
 */

import { clsx } from 'clsx';
import { TaskPriority } from '../../types';

export interface TaskCardVariantProps {
  priority: TaskPriority;
  isOverdue?: boolean;
}

export interface PriorityBadgeVariantProps {
  priority: TaskPriority;
}

export function getTaskCardClassName(props: TaskCardVariantProps): string {
  const { priority, isOverdue = false } = props;

  return clsx(
    'bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md',
    'border-l-4',
    {
      'border-l-red-500': priority === TaskPriority.High,
      'border-l-yellow-500': priority === TaskPriority.Medium,
      'border-l-green-500': priority === TaskPriority.Low,
      'bg-red-50': isOverdue,
    }
  );
}

export function getPriorityBadgeClassName(props: PriorityBadgeVariantProps): string {
  const { priority } = props;

  return clsx('px-2 py-1 rounded text-xs font-medium', {
    'bg-red-100 text-red-800': priority === TaskPriority.High,
    'bg-yellow-100 text-yellow-800': priority === TaskPriority.Medium,
    'bg-green-100 text-green-800': priority === TaskPriority.Low,
  });
}
