import { format } from 'date-fns';

export function formatDate(date: string): string {
  return format(new Date(date), 'yy-MM-dd HH:mm:ss');
}