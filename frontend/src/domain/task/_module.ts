/**
 * @module task
 * @summary Task management domain with creation, listing, and CRUD operations
 * @domain functional
 * @dependencies ['@/core/lib/api', '@tanstack/react-query', 'react-hook-form', 'zod']
 * @version 1.0.0
 * @author Development Team
 * @lastModified 2024-01-15
 */

export * from './components/TaskForm';
export * from './components/TaskList';
export * from './components/TaskCard';
export * from './hooks/useTaskCreate';
export * from './hooks/useTaskList';
export * from './services/taskService';
export * from './types';

export const moduleMetadata = {
  name: 'task',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: ['TaskForm', 'TaskList', 'TaskCard'],
  publicHooks: ['useTaskCreate', 'useTaskList'],
  publicServices: ['taskService'],
  dependencies: {
    internal: ['@/core/lib/api', '@/core/components'],
    external: ['react', 'react-hook-form', 'zod', '@tanstack/react-query'],
    domains: [],
  },
  exports: {
    components: ['TaskForm', 'TaskList', 'TaskCard'],
    hooks: ['useTaskCreate', 'useTaskList'],
    services: ['taskService'],
    types: ['Task', 'TaskPriority', 'TaskStatus', 'CreateTaskDto'],
    utils: [],
  },
} as const;
