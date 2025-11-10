/**
 * @types CategoryListTypes
 * @summary Type definitions for CategoryList component
 */

import type { Category } from '../../types';

export interface CategoryListProps {
  userId: string;
  onCategoryClick?: (category: Category) => void;
  onCategoryEdit?: (category: Category) => void;
  onCategoryDelete?: (category: Category) => void;
  showTaskCount?: boolean;
}
