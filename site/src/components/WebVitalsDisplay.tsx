/**
 * Web Vitals Dashboard Component
 * Real-time monitoring display for Core Web Vitals
 */

'use client';

import { useState, useEffect } from 'react';
import { checkWebVitalsTargets, getSessionMetrics, initWebVitalsMonitoring } from '@/lib/web-vitals-monitor';

interface WebVitalsDisplayProps {
  showInProduction?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function WebVitalsDisplay({ 
  showInProduction = false, 
  position = 'bottom-right' 
}: WebVitalsDisplayProps) {
  const [metrics, setMetrics] = useState<Array<{ name: string; value: number; rating: string; id: string }>>([]);
  const [targets, setTargets] = useState<Record<string, unknown>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or if explicitly enabled in production
    if (process.env.NODE_ENV !== 'development' && !showInProduction) {
      return;
    }

    // Initialize monitoring
    initWebVitalsMonitoring();

    // Update metrics periodically
    const updateMetrics = () => {
      setMetrics(getSessionMetrics());
      setTargets(checkWebVitalsTargets());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);

    // Listen for new metrics
    const handleWebVital = () => {
      updateMetrics();
    };

    window.addEventListener('web-vital', handleWebVital as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('web-vital', handleWebVital as EventListener);
    };
  }, [showInProduction]);

  if (process.env.NODE_ENV !== 'development' && !showInProduction) {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const getMetricColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-400';
      case 'needs-improvement': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'CLS') return value.toFixed(3);
    if (name.includes('TIME') || name === 'LCP' || name === 'FCP' || name === 'TTFB' || name === 'FID' || name === 'INP') {
      return `${Math.round(value)}ms`;
    }
    return value.toString();
  };

  const getTarget = (name: string) => {
    switch (name) {
      case 'LCP': return '< 2.5s';
      case 'FID': return '< 100ms';
      case 'CLS': return '< 0.1';
      case 'INP': return '< 200ms';
      case 'FCP': return '< 1.8s';
      case 'TTFB': return '< 800ms';
      default: return '';
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed ${positionClasses[position]} z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-mono hover:bg-gray-800 transition-colors`}
        title="Toggle Web Vitals Dashboard"
      >
        📊 Web Vitals
      </button>

      {/* Dashboard */}
      {isVisible && (
        <div className={`fixed ${positionClasses[position]} z-40 bg-gray-900/95 backdrop-blur-sm text-white p-4 rounded-lg text-xs font-mono w-80 max-h-96 overflow-y-auto mt-12`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm">Web Vitals Monitor</h3>
            <div className={`px-2 py-1 rounded text-xs ${
              targets.overall ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {targets.overall ? '✅ PASS' : '❌ FAIL'}
            </div>
          </div>

          {/* Core Web Vitals */}
          <div className="space-y-2 mb-4">
            <h4 className="font-semibold text-yellow-400">Core Web Vitals</h4>
            {['LCP', 'FID', 'CLS'].map(metricName => {
              const metric = metrics.find(m => m.name === metricName);
              return (
                <div key={metricName} className="flex justify-between items-center">
                  <span className="font-medium">{metricName}</span>
                  <div className="text-right">
                    <div className={`${metric ? getMetricColor(metric.rating) : 'text-gray-500'}`}>
                      {metric ? formatValue(metricName, metric.value) : 'N/A'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Target: {getTarget(metricName)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Other Metrics */}
          <div className="space-y-2 mb-4">
            <h4 className="font-semibold text-blue-400">Other Metrics</h4>
            {['FCP', 'TTFB', 'INP'].map(metricName => {
              const metric = metrics.find(m => m.name === metricName);
              return (
                <div key={metricName} className="flex justify-between items-center">
                  <span className="font-medium">{metricName}</span>
                  <div className="text-right">
                    <div className={`${metric ? getMetricColor(metric.rating) : 'text-gray-500'}`}>
                      {metric ? formatValue(metricName, metric.value) : 'N/A'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Target: {getTarget(metricName)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Timing */}
          {metrics.some(m => m.name.includes('_TIME')) && (
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-400">Performance Timing</h4>
              {metrics.filter(m => m.name.includes('_TIME')).map(metric => (
                <div key={metric.name} className="flex justify-between items-center">
                  <span className="font-medium">{metric.name.replace('_', ' ')}</span>
                  <div className="text-gray-300">
                    {formatValue(metric.name, metric.value)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="mt-4 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              Page: {window.location.pathname}
              <br />
              Metrics: {metrics.length} recorded
              <br />
              Session: {sessionStorage.getItem('web-vitals-session')?.slice(-8)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Simple Web Vitals reporter for production
 */
export function WebVitalsReporter() {
  useEffect(() => {
    initWebVitalsMonitoring();
  }, []);

  return null;
}

export default WebVitalsDisplay;