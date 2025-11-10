/**
 * @variants CategoryFormVariants
 * @summary Style variants for CategoryForm component
 */

import { clsx } from 'clsx';

export function getCategoryFormClassName(): string {
  return clsx('bg-white rounded-lg shadow p-6 max-w-2xl');
}
