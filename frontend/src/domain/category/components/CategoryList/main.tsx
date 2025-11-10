/**
 * @component CategoryList
 * @summary List component for displaying categories
 * @domain category
 * @type domain-component
 * @category display
 */

import { useCategoryList } from '../../hooks/useCategoryList';
import { CategoryCard } from '../CategoryCard';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { CategoryListProps } from './types';

export const CategoryList = ({
  userId,
  onCategoryClick,
  onCategoryEdit,
  onCategoryDelete,
  showTaskCount = true,
}: CategoryListProps) => {
  const { categories, isLoading, error, refetch } = useCategoryList({
    params: { idUser: userId },
  });

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar categorias"
        message={error.message}
        onRetry={refetch}
        variant="error"
      />
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhuma categoria encontrada</p>
        <p className="text-gray-400 text-sm mt-2">Crie sua primeira categoria para começar!</p>
      </div>
    );
  }

  const defaultCategories = categories.filter((c) => c.isDefault);
  const customCategories = categories.filter((c) => !c.isDefault);

  return (
    <div className="space-y-6">
      {defaultCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Categorias Padrão</h3>
          <div className="space-y-3">
            {defaultCategories.map((category) => (
              <CategoryCard
                key={category.idCategory}
                category={category}
                taskCount={showTaskCount ? 0 : undefined}
                onClick={onCategoryClick}
                onEdit={onCategoryEdit}
                onDelete={onCategoryDelete}
              />
            ))}
          </div>
        </div>
      )}

      {customCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Minhas Categorias</h3>
          <div className="space-y-3">
            {customCategories.map((category) => (
              <CategoryCard
                key={category.idCategory}
                category={category}
                taskCount={showTaskCount ? 0 : undefined}
                onClick={onCategoryClick}
                onEdit={onCategoryEdit}
                onDelete={onCategoryDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
