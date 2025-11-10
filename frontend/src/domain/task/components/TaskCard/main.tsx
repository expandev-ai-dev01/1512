/**
 * @component TaskCard
 * @summary Card component for displaying task information
 * @domain task
 * @type domain-component
 * @category display
 */

import { formatDate } from '@/core/utils/format';
import { TaskPriority } from '../../types';
import type { TaskCardProps } from './types';
import { getTaskCardClassName, getPriorityBadgeClassName } from './variants';

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const priorityLabel = {
    [TaskPriority.Low]: 'Baixa',
    [TaskPriority.Medium]: 'Média',
    [TaskPriority.High]: 'Alta',
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueSoon =
    task.dueDate && new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  return (
    <div
      className={getTaskCardClassName({ priority: task.priority, isOverdue: !!isOverdue })}
      onClick={() => onClick?.(task)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
          {task.description && <p className="text-gray-600 text-sm mb-2">{task.description}</p>}
        </div>
        <span className={getPriorityBadgeClassName({ priority: task.priority })}>
          {priorityLabel[task.priority]}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span
              className={
                isOverdue
                  ? 'text-red-600 font-medium'
                  : isDueSoon
                  ? 'text-yellow-600 font-medium'
                  : ''
              }
            >
              {formatDate(task.dueDate)}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <span>🕐</span>
          <span>{formatDate(task.dateCreated)}</span>
        </div>
      </div>

      {isOverdue && <div className="mt-2 text-xs text-red-600 font-medium">⚠️ Tarefa vencida</div>}
      {isDueSoon && !isOverdue && (
        <div className="mt-2 text-xs text-yellow-600 font-medium">⏰ Vence em breve</div>
      )}
    </div>
  );
};
