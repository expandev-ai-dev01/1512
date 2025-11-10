/**
 * @types CategoryFormTypes
 * @summary Type definitions for CategoryForm component
 */

import type { Category } from '../../types';

export interface CategoryFormProps {
  onSuccess?: (categoryId: string) => void;
  onCancel?: () => void;
  userId: string;
  editCategory?: Category;
  parentCategoryId?: string;
}

export interface CategoryFormData {
  name: string;
  color: string;
  description?: string;
  parentCategoryId?: string;
}
