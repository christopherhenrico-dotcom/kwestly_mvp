// Re-export types from the main types module for backward compatibility
export type { Quest, User } from '@/types';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  read: boolean;
  timestamp: number;
}
