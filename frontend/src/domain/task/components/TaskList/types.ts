/**
 * @types TaskListTypes
 * @summary Type definitions for TaskList component
 */

import type { Task } from '../../types';

export interface TaskListProps {
  userId: string;
  onTaskClick?: (task: Task) => void;
}
