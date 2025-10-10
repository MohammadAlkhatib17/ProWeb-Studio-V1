// Type definitions for monitoring and analytics

export interface MonitoringData {
  [key: string]: unknown;
}

export interface WebVitalsEntry {
  name: string;
  value: number;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType?: string;
}

export interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  [key: string]: unknown;
}

export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, string | number | boolean>;
  timestamp?: number;
}

export interface StructuredDataItem {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

export interface MetadataProperties {
  [key: string]: string | number | boolean | undefined;
}

export interface DashboardConfig {
  [key: string]: unknown;
}

export interface ValidationResult extends Record<string, unknown> {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface ErrorResponse {
  error: string;
  details?: string;
  statusCode?: number;
}

export interface FormData extends Record<string, unknown> {
  [key: string]: string | number | boolean | File | undefined;
}

// Generic safe replacements for any
export type SafeUnknown = unknown;
export type ConfigObject = Record<string, unknown>;
export type DataPayload = Record<string, unknown>;
export type EventData = Record<string, unknown>;
export type APIResponse = Record<string, unknown>;
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type ErrorDetails = { message?: string; stack?: string; code?: string | number };
export type MetricValue = string | number | boolean | null | undefined;