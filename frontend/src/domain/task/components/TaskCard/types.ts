/**
 * @types TaskCardTypes
 * @summary Type definitions for TaskCard component
 */

import type { Task } from '../../types';

export interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}
