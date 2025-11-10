/**
 * @component CategoryForm
 * @summary Form component for creating and editing categories
 * @domain category
 * @type domain-component
 * @category form
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useCategoryCreate } from '../../hooks/useCategoryCreate';
import { useCategoryUpdate } from '../../hooks/useCategoryUpdate';
import type { CategoryFormProps, CategoryFormData } from './types';
import { getCategoryFormClassName } from './variants';

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres')
    .refine((val) => val.trim().length > 0, 'O nome não pode conter apenas espaços em branco'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida (formato: #RRGGBB)'),
  description: z.string().max(200, 'A descrição deve ter no máximo 200 caracteres').optional(),
  parentCategoryId: z.string().uuid().optional(),
});

const DEFAULT_COLORS = [
  '#e74c3c',
  '#3498db',
  '#f39c12',
  '#2ecc71',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#34495e',
];

export const CategoryForm = ({
  onSuccess,
  onCancel,
  userId,
  editCategory,
  parentCategoryId,
}: CategoryFormProps) => {
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const isEditing = !!editCategory;

  const { createCategory, isCreating } = useCategoryCreate({
    onSuccess: (category) => {
      setFeedbackMessage({
        type: 'success',
        text: 'Categoria criada com sucesso!',
      });
      reset();
      setTimeout(() => setFeedbackMessage(null), 3000);
      onSuccess?.(category.idCategory);
    },
    onError: (error) => {
      const errorMessage = error.message || 'Erro ao criar categoria';
      if (errorMessage.includes('categoryNameAlreadyExists')) {
        setFeedbackMessage({
          type: 'error',
          text: 'Você já possui uma categoria com este nome',
        });
      } else if (errorMessage.includes('maxCategoriesLimitReached')) {
        setFeedbackMessage({
          type: 'error',
          text: 'Você atingiu o limite máximo de 50 categorias',
        });
      } else if (errorMessage.includes('maxNestingLevelReached')) {
        setFeedbackMessage({
          type: 'error',
          text: 'Não é possível criar mais níveis de subcategorias',
        });
      } else {
        setFeedbackMessage({
          type: 'error',
          text: errorMessage,
        });
      }
      setTimeout(() => setFeedbackMessage(null), 5000);
    },
  });

  const { updateCategory, isUpdating } = useCategoryUpdate({
    onSuccess: () => {
      setFeedbackMessage({
        type: 'success',
        text: 'Categoria atualizada com sucesso!',
      });
      setTimeout(() => setFeedbackMessage(null), 3000);
      onSuccess?.(editCategory!.idCategory);
    },
    onError: (error) => {
      const errorMessage = error.message || 'Erro ao atualizar categoria';
      if (errorMessage.includes('cannotModifyDefaultCategory')) {
        setFeedbackMessage({
          type: 'error',
          text: 'Categorias padrão não podem ser modificadas',
        });
      } else {
        setFeedbackMessage({
          type: 'error',
          text: errorMessage,
        });
      }
      setTimeout(() => setFeedbackMessage(null), 5000);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: editCategory?.name || '',
      color: editCategory?.color || '#3498db',
      description: editCategory?.description || '',
      parentCategoryId: parentCategoryId || editCategory?.parentCategoryId || undefined,
    },
  });

  const selectedColor = watch('color');

  const onSubmit = async (data: CategoryFormData) => {
    if (isEditing) {
      await updateCategory(editCategory.idCategory, {
        idUser: userId,
        name: data.name,
        color: data.color,
        description: data.description || null,
      });
    } else {
      await createCategory({
        idUser: userId,
        name: data.name,
        color: data.color,
        description: data.description || null,
        parentCategoryId: data.parentCategoryId || null,
      });
    }
  };

  const isProcessing = isCreating || isUpdating;

  return (
    <div className={getCategoryFormClassName()}>
      {feedbackMessage && (
        <div
          className={`mb-4 p-3 rounded ${
            feedbackMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Categoria <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome da categoria"
            disabled={editCategory?.isDefault}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Cor <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              id="color"
              type="color"
              {...register('color')}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600">{selectedColor}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color)}
                className={`w-8 h-8 rounded border-2 ${
                  selectedColor === color ? 'border-gray-900' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descrição opcional da categoria"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
              disabled={isProcessing}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isProcessing || editCategory?.isDefault}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing
              ? isEditing
                ? 'Atualizando...'
                : 'Criando...'
              : isEditing
              ? 'Atualizar Categoria'
              : 'Criar Categoria'}
          </button>
        </div>
      </form>
    </div>
  );
};
