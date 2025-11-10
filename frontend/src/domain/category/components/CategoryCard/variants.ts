/**
 * @variants CategoryCardVariants
 * @summary Style variants for CategoryCard component
 */

import { clsx } from 'clsx';

export function getCategoryCardClassName(): string {
  return clsx(
    'bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md',
    'border-l-4'
  );
}
