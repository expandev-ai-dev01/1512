/**
 * @component CategorySelector
 * @summary Component for selecting categories for tasks
 * @domain category
 * @type domain-component
 * @category form
 */

import { useCategoryList } from '../../hooks/useCategoryList';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { CategorySelectorProps } from './types';
import { getCategorySelectorClassName, getCategoryBadgeClassName } from './variants';

export const CategorySelector = ({
  userId,
  selectedCategories,
  onCategoriesChange,
  maxCategories = 10,
  allowMultiple = true,
}: CategorySelectorProps) => {
  const { categories, isLoading } = useCategoryList({
    params: { idUser: userId },
  });

  if (isLoading) {
    return <LoadingSpinner size="small" />;
  }

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      if (allowMultiple) {
        if (selectedCategories.length >= maxCategories) {
          alert(`Você pode selecionar no máximo ${maxCategories} categorias`);
          return;
        }
        onCategoriesChange([...selectedCategories, categoryId]);
      } else {
        onCategoriesChange([categoryId]);
      }
    }
  };

  return (
    <div className={getCategorySelectorClassName()}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Categorias {allowMultiple && `(máx. ${maxCategories})`}
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.idCategory);
          return (
            <button
              key={category.idCategory}
              type="button"
              onClick={() => handleCategoryToggle(category.idCategory)}
              className={getCategoryBadgeClassName({ isSelected })}
              style={{
                borderColor: isSelected ? category.color : undefined,
                backgroundColor: isSelected ? `${category.color}20` : undefined,
              }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
              <span>{category.name}</span>
              {isSelected && <span>✓</span>}
            </button>
          );
        })}
      </div>
      {selectedCategories.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {selectedCategories.length} {selectedCategories.length === 1 ? 'categoria' : 'categorias'}{' '}
          selecionada{selectedCategories.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};
