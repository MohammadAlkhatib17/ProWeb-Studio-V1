/**
 * In-memory storage for web vitals metrics
 * Dev-safe implementation with configurable limits
 */

import { VitalEvent } from './types';

// In-memory storage (resets on server restart - acceptable for dev/monitoring)
let vitalEvents: VitalEvent[] = [];

// Configuration
const MAX_EVENTS = 1000; // Keep last 1000 events
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Add a vital event to storage
 */
export function addVitalEvent(event: VitalEvent): void {
  // Clean old events before adding
  cleanOldEvents();
  
  vitalEvents.push(event);
  
  // Limit storage size
  if (vitalEvents.length > MAX_EVENTS) {
    vitalEvents = vitalEvents.slice(-MAX_EVENTS);
  }
}

/**
 * Get recent vital events
 */
export function getVitalEvents(limit: number = 100): VitalEvent[] {
  cleanOldEvents();
  return vitalEvents.slice(-limit).reverse(); // Most recent first
}

/**
 * Get all vital events (for stats calculation)
 */
export function getAllVitalEvents(): VitalEvent[] {
  cleanOldEvents();
  return vitalEvents;
}

/**
 * Clear all events (useful for testing)
 */
export function clearVitalEvents(): void {
  vitalEvents = [];
}

/**
 * Remove events older than MAX_AGE_MS
 */
function cleanOldEvents(): void {
  const now = Date.now();
  vitalEvents = vitalEvents.filter(event => 
    now - event.timestamp < MAX_AGE_MS
  );
}

/**
 * Get storage statistics
 */
export function getStorageStats() {
  return {
    totalEvents: vitalEvents.length,
    oldestEvent: vitalEvents.length > 0 ? vitalEvents[0].timestamp : null,
    newestEvent: vitalEvents.length > 0 ? vitalEvents[vitalEvents.length - 1].timestamp : null,
    maxEvents: MAX_EVENTS,
    maxAgeMs: MAX_AGE_MS,
  };
}
