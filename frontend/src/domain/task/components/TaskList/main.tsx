/**
 * @component TaskList
 * @summary List component for displaying tasks
 * @domain task
 * @type domain-component
 * @category display
 */

import { useTaskList } from '../../hooks/useTaskList';
import { TaskCard } from '../TaskCard';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { TaskListProps } from './types';
import { TaskPriority } from '../../types';

export const TaskList = ({ userId, onTaskClick }: TaskListProps) => {
  const { tasks, isLoading, error, refetch } = useTaskList({
    params: { idUser: userId },
  });

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar tarefas"
        message={error.message}
        onRetry={refetch}
        variant="error"
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhuma tarefa encontrada</p>
        <p className="text-gray-400 text-sm mt-2">Crie sua primeira tarefa para começar!</p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
  });

  const highPriorityTasks = sortedTasks.filter((t) => t.priority === TaskPriority.High);
  const mediumPriorityTasks = sortedTasks.filter((t) => t.priority === TaskPriority.Medium);
  const lowPriorityTasks = sortedTasks.filter((t) => t.priority === TaskPriority.Low);

  return (
    <div className="space-y-6">
      {highPriorityTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Prioridade Alta</h3>
          <div className="space-y-3">
            {highPriorityTasks.map((task) => (
              <TaskCard key={task.idTask} task={task} onClick={onTaskClick} />
            ))}
          </div>
        </div>
      )}

      {mediumPriorityTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Prioridade Média</h3>
          <div className="space-y-3">
            {mediumPriorityTasks.map((task) => (
              <TaskCard key={task.idTask} task={task} onClick={onTaskClick} />
            ))}
          </div>
        </div>
      )}

      {lowPriorityTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Prioridade Baixa</h3>
          <div className="space-y-3">
            {lowPriorityTasks.map((task) => (
              <TaskCard key={task.idTask} task={task} onClick={onTaskClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
