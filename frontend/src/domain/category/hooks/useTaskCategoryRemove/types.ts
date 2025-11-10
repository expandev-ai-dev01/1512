/**
 * @types UseTaskCategoryRemoveTypes
 * @summary Type definitions for useTaskCategoryRemove hook
 */

export interface UseTaskCategoryRemoveOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UseTaskCategoryRemoveReturn {
  removeCategory: (idTask: string, idCategory: string, idUser: string) => Promise<void>;
  isRemoving: boolean;
  error: Error | null;
}
