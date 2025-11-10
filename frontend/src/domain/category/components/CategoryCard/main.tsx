/**
 * @component CategoryCard
 * @summary Card component for displaying category information
 * @domain category
 * @type domain-component
 * @category display
 */

import type { CategoryCardProps } from './types';
import { getCategoryCardClassName } from './variants';

export const CategoryCard = ({
  category,
  taskCount = 0,
  onClick,
  onEdit,
  onDelete,
}: CategoryCardProps) => {
  return (
    <div
      className={getCategoryCardClassName()}
      onClick={() => onClick?.(category)}
      style={{ borderLeftColor: category.color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            {category.isDefault && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Padrão</span>
            )}
          </div>
          {category.description && (
            <p className="text-gray-600 text-sm mb-2">{category.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {taskCount > 0 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
              {taskCount} {taskCount === 1 ? 'tarefa' : 'tarefas'}
            </span>
          )}
          {!category.isDefault && (
            <>
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(category);
                  }}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  title="Editar categoria"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(category);
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Excluir categoria"
                >
                  🗑️
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
