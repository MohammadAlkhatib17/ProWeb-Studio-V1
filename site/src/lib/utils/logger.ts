/**
 * Production-safe logger utility
 * 
 * In development: All console methods work normally
 * In production: console.log is stripped by Next.js compiler, but this utility
 * provides a consistent API for logging that respects environment
 * 
 * @example
 * import { logger } from '@/lib/utils/logger';
 * 
 * logger.log('Debug info');  // Only in development
 * logger.info('Info message'); // Always logged
 * logger.warn('Warning');     // Always logged
 * logger.error('Error');      // Always logged
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log debug information (development only)
   * Automatically stripped in production by Next.js compiler
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log informational messages (always logged)
   */
  info: (...args: unknown[]) => {
    console.info(...args);
  },

  /**
   * Log warnings (always logged)
   */
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },

  /**
   * Log errors (always logged)
   */
  error: (...args: unknown[]) => {
    console.error(...args);
  },

  /**
   * Log with table formatting (development only)
   */
  table: (data: unknown) => {
    if (isDevelopment && console.table) {
      console.table(data);
    }
  },

  /**
   * Start a timer (development only)
   */
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },

  /**
   * End a timer (development only)
   */
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },

  /**
   * Log to console group (development only)
   */
  group: (label: string) => {
    if (isDevelopment && console.group) {
      console.group(label);
    }
  },

  /**
   * End console group (development only)
   */
  groupEnd: () => {
    if (isDevelopment && console.groupEnd) {
      console.groupEnd();
    }
  },
};
