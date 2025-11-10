/**
 * @component TaskForm
 * @summary Form component for creating tasks with validation
 * @domain task
 * @type domain-component
 * @category form
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useTaskCreate } from '../../hooks/useTaskCreate';
import { TaskPriority } from '../../types';
import type { TaskFormProps, TaskFormData } from './types';
import { getTaskFormClassName } from './variants';

const taskFormSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres')
    .refine((val) => val.trim().length > 0, 'O título não pode conter apenas espaços em branco'),
  description: z.string().max(500, 'A descrição deve ter no máximo 500 caracteres').optional(),
  dueDate: z.string().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
});

export const TaskForm = ({ onSuccess, onCancel, userId, quickMode = false }: TaskFormProps) => {
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
  } | null>(null);

  const { createTask, isCreating } = useTaskCreate({
    onSuccess: (task, warning) => {
      if (warning === 'dueDateInPast') {
        setFeedbackMessage({
          type: 'warning',
          text: 'Atenção: A data de vencimento informada já passou',
        });
      } else {
        setFeedbackMessage({
          type: 'success',
          text: 'Tarefa criada com sucesso!',
        });
      }
      reset();
      setTimeout(() => setFeedbackMessage(null), 5000);
      onSuccess?.(task.idTask, warning);
    },
    onError: (error) => {
      const errorMessage = error.message || 'Erro ao criar tarefa';
      if (errorMessage.includes('titleAlreadyExists')) {
        setFeedbackMessage({
          type: 'error',
          text: 'Você já possui uma tarefa com este título',
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
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      priority: TaskPriority.Medium,
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    await createTask({
      idUser: userId,
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate || null,
      priority: data.priority,
    });
  };

  return (
    <div className={getTaskFormClassName({ quickMode })}>
      {feedbackMessage && (
        <div
          className={`mb-4 p-3 rounded ${
            feedbackMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : feedbackMessage.type === 'warning'
              ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o título da tarefa"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {!quickMode && (
          <>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição detalhada da tarefa (opcional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Vencimento
              </label>
              <input
                id="dueDate"
                type="date"
                {...register('dueDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Prioridade
              </label>
              <select
                id="priority"
                {...register('priority', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={TaskPriority.Low}>Baixa</option>
                <option value={TaskPriority.Medium}>Média</option>
                <option value={TaskPriority.High}>Alta</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
              )}
            </div>
          </>
        )}

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
              disabled={isCreating}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Criando...' : quickMode ? 'Criar Rápido' : 'Criar Tarefa'}
          </button>
        </div>
      </form>
    </div>
  );
};
