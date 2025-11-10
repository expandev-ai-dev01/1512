/**
 * @types CategorySelectorTypes
 * @summary Type definitions for CategorySelector component
 */

export interface CategorySelectorProps {
  userId: string;
  selectedCategories: string[];
  onCategoriesChange: (categoryIds: string[]) => void;
  maxCategories?: number;
  allowMultiple?: boolean;
}
