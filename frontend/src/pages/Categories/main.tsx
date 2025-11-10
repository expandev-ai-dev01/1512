/**
 * @page CategoriesPage
 * @summary Categories management page with creation, editing and deletion
 * @domain category
 * @type management-page
 * @category category-management
 */

import { useState } from 'react';
import { CategoryForm } from '@/domain/category/components/CategoryForm';
import { CategoryList } from '@/domain/category/components/CategoryList';
import { useCategoryDelete } from '@/domain/category/hooks/useCategoryDelete';
import type { Category } from '@/domain/category/types';

export const CategoriesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [deletingCategory, setDeletingCategory] = useState<Category | undefined>(undefined);
  const [moveToCategory, setMoveToCategory] = useState<string>('');
  const mockUserId = '00000000-0000-0000-0000-000000000001';

  const { deleteCategory, isDeleting } = useCategoryDelete({
    onSuccess: () => {
      setDeletingCategory(undefined);
      setMoveToCategory('');
    },
    onError: (error) => {
      alert(error.message || 'Erro ao excluir categoria');
    },
  });

  const handleCategoryClick = (category: Category) => {
    console.log('Category clicked:', category);
  };

  const handleCategoryEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCategoryDelete = (category: Category) => {
    setDeletingCategory(category);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;

    await deleteCategory(deletingCategory.idCategory, mockUserId, moveToCategory || undefined);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingCategory(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Categorias</h1>
        <button
          onClick={() => {
            setEditingCategory(undefined);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Nova Categoria
        </button>
      </div>

      {showForm && (
        <CategoryForm
          userId={mockUserId}
          editCategory={editingCategory}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}

      {deletingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Excluir Categoria: {deletingCategory.name}
            </h3>
            <p className="text-gray-600 mb-4">O que deseja fazer com as tarefas desta categoria?</p>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deleteOption"
                  value=""
                  checked={moveToCategory === ''}
                  onChange={(e) => setMoveToCategory(e.target.value)}
                />
                <span className="text-sm">Deixar tarefas sem categoria</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deleteOption"
                  value="move"
                  checked={moveToCategory === 'move'}
                  onChange={(e) => setMoveToCategory(e.target.value)}
                />
                <span className="text-sm">Mover para outra categoria (em breve)</span>
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setDeletingCategory(undefined);
                  setMoveToCategory('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CategoryList
        userId={mockUserId}
        onCategoryClick={handleCategoryClick}
        onCategoryEdit={handleCategoryEdit}
        onCategoryDelete={handleCategoryDelete}
        showTaskCount={true}
      />
    </div>
  );
};

export default CategoriesPage;
