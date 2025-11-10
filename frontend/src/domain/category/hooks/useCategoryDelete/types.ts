/**
 * @types UseCategoryDeleteTypes
 * @summary Type definitions for useCategoryDelete hook
 */

export interface UseCategoryDeleteOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UseCategoryDeleteReturn {
  deleteCategory: (id: string, idUser: string, moveToCategory?: string) => Promise<void>;
  isDeleting: boolean;
  error: Error | null;
}
