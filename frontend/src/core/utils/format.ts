import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * @utility formatDate
 * @summary Formats a date string or Date object to Brazilian format
 * @param date - Date string or Date object
 * @param pattern - Date format pattern (default: 'dd/MM/yyyy')
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, pattern: string = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, pattern, { locale: ptBR });
  } catch (error: unknown) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * @utility formatDateTime
 * @summary Formats a date string or Date object to Brazilian datetime format
 * @param date - Date string or Date object
 * @returns Formatted datetime string
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};
