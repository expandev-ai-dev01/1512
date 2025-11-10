/**
 * @module category
 * @summary Category management domain with CRUD operations and task categorization
 * @domain functional
 * @dependencies ['@/core/lib/api', '@tanstack/react-query', 'react-hook-form', 'zod']
 * @version 1.0.0
 * @author Development Team
 * @lastModified 2024-01-15
 */

export * from './components/CategoryForm';
export * from './components/CategoryList';
export * from './components/CategoryCard';
export * from './components/CategorySelector';
export * from './hooks/useCategoryCreate';
export * from './hooks/useCategoryList';
export * from './hooks/useCategoryUpdate';
export * from './hooks/useCategoryDelete';
export * from './hooks/useTaskCategoryAssign';
export * from './hooks/useTaskCategoryRemove';
export * from './services/categoryService';
export * from './services/taskCategoryService';
export * from './types';

export const moduleMetadata = {
  name: 'category',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: ['CategoryForm', 'CategoryList', 'CategoryCard', 'CategorySelector'],
  publicHooks: [
    'useCategoryCreate',
    'useCategoryList',
    'useCategoryUpdate',
    'useCategoryDelete',
    'useTaskCategoryAssign',
    'useTaskCategoryRemove',
  ],
  publicServices: ['categoryService', 'taskCategoryService'],
  dependencies: {
    internal: ['@/core/lib/api', '@/core/components'],
    external: ['react', 'react-hook-form', 'zod', '@tanstack/react-query'],
    domains: ['@/domain/task'],
  },
  exports: {
    components: ['CategoryForm', 'CategoryList', 'CategoryCard', 'CategorySelector'],
    hooks: [
      'useCategoryCreate',
      'useCategoryList',
      'useCategoryUpdate',
      'useCategoryDelete',
      'useTaskCategoryAssign',
      'useTaskCategoryRemove',
    ],
    services: ['categoryService', 'taskCategoryService'],
    types: ['Category', 'CreateCategoryDto', 'UpdateCategoryDto', 'TaskCategory'],
    utils: [],
  },
} as const;
