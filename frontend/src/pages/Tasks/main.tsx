/**
 * @page TasksPage
 * @summary Tasks management page with creation and listing
 * @domain task
 * @type management-page
 * @category task-management
 */

import { useState } from 'react';
import { TaskForm } from '@/domain/task/components/TaskForm';
import { TaskList } from '@/domain/task/components/TaskList';
import type { Task } from '@/domain/task/types';

export const TasksPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const mockUserId = '00000000-0000-0000-0000-000000000001';

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
  };

  const handleSuccess = (taskId: string, warning?: string) => {
    console.log('Task created:', taskId, warning);
    setShowForm(false);
    setShowQuickForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Tarefas</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowQuickForm(!showQuickForm)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ⚡ Criar Rápido
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ Nova Tarefa
          </button>
        </div>
      </div>

      {showQuickForm && (
        <TaskForm
          userId={mockUserId}
          quickMode={true}
          onSuccess={handleSuccess}
          onCancel={() => setShowQuickForm(false)}
        />
      )}

      {showForm && (
        <TaskForm
          userId={mockUserId}
          quickMode={false}
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      <TaskList userId={mockUserId} onTaskClick={handleTaskClick} />
    </div>
  );
};

export default TasksPage;
