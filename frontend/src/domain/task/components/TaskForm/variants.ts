/**
 * @variants TaskFormVariants
 * @summary Style variants for TaskForm component
 */

import { clsx } from 'clsx';

export interface TaskFormVariantProps {
  quickMode?: boolean;
}

export function getTaskFormClassName(props: TaskFormVariantProps): string {
  const { quickMode = false } = props;

  return clsx('bg-white rounded-lg shadow p-6', {
    'max-w-md': quickMode,
    'max-w-2xl': !quickMode,
  });
}
