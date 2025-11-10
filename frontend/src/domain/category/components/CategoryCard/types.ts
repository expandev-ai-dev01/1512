/**
 * @types CategoryCardTypes
 * @summary Type definitions for CategoryCard component
 */

import type { Category } from '../../types';

export interface CategoryCardProps {
  category: Category;
  taskCount?: number;
  onClick?: (category: Category) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}
