/**
 * Monitoring library exports
 * Central export point for web vitals monitoring system
 */

export * from './types';
export * from './utils';
export * from './useWebVitals';
export { addVitalEvent, getVitalEvents, getAllVitalEvents, getStorageStats } from './storage';
