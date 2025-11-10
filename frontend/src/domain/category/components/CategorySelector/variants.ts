/**
 * @variants CategorySelectorVariants
 * @summary Style variants for CategorySelector component
 */

import { clsx } from 'clsx';

export function getCategorySelectorClassName(): string {
  return clsx('space-y-2');
}

export interface CategoryBadgeVariantProps {
  isSelected: boolean;
}

export function getCategoryBadgeClassName(props: CategoryBadgeVariantProps): string {
  const { isSelected } = props;

  return clsx(
    'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all',
    'border-2',
    {
      'border-gray-300 bg-white hover:bg-gray-50': !isSelected,
      'font-medium': isSelected,
    }
  );
}
