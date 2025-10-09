/**
 * Comprehensive monitoring configuration
 */

export const MONITORING_CONFIG = {
  // Core Web Vitals thresholds (following Google's recommendations)
  CORE_WEB_VITALS: {
    THRESHOLDS: {
      LCP: {
        GOOD: 2500,
        NEEDS_IMPROVEMENT: 4000,
      },
      FID: {
        GOOD: 100,
        NEEDS_IMPROVEMENT: 300,
      },
      CLS: {
        GOOD: 0.1,
        NEEDS_IMPROVEMENT: 0.25,
      },
      TTFB: {
        GOOD: 800,
        NEEDS_IMPROVEMENT: 1800,
      },
    },
    COLLECTION_INTERVAL: 30000, // 30 seconds
    RETENTION_DAYS: 90,
  },

  // SEO Health check configuration
  SEO_HEALTH: {
    CHECK_INTERVAL: 3600000, // 1 hour
    SCORING_WEIGHTS: {
      META_TAGS: 20,
      STRUCTURED_DATA: 15,
      PERFORMANCE: 25,
      INDEXABILITY: 20,
      CANONICALIZATION: 10,
      SOCIAL_SHARING: 10,
    },
    CRITICAL_ISSUES: [
      'missing-title',
      'missing-meta-description',
      'noindex-detected',
      'canonical-missing',
      'robots-blocked',
    ],
  },

  // 404 monitoring configuration
  NOT_FOUND_MONITORING: {
    TRACKING_ENABLED: true,
    SMART_REDIRECTS: true,
    FREQUENCY_THRESHOLD: 5, // Alert if same 404 occurs 5+ times
    SIMILARITY_THRESHOLD: 0.8, // For suggesting redirects
    RETENTION_DAYS: 365,
    IGNORE_PATTERNS: [
      /\.php$/,
      /\.asp$/,
      /\.jsp$/,
      /wp-admin/,
      /wp-content/,
      /admin/,
      /\.env$/,
      /\.git/,
    ],
  },

  // Search query tracking
  SEARCH_CONSOLE: {
    UPDATE_INTERVAL: 3600000, // 1 hour
    DATA_RETENTION_DAYS: 90,
    MIN_IMPRESSIONS: 10, // Only track queries with 10+ impressions
    OPPORTUNITY_THRESHOLD: {
      HIGH_VOLUME_LOW_CTR: { impressions: 1000, ctr: 0.02 },
      RANKING_OPPORTUNITY: { position: 11, impressions: 100 },
    },
  },

  // Competitor analysis
  COMPETITOR_ANALYSIS: {
    UPDATE_INTERVAL: 86400000, // 24 hours
    MAX_COMPETITORS: 5,
    KEYWORD_LIMIT: 1000,
    OPPORTUNITY_SCORING: {
      HIGH: { volume: 1000, difficulty: 30, gap: -20 },
      MEDIUM: { volume: 500, difficulty: 50, gap: -10 },
    },
  },

  // Sitemap validation
  SITEMAP_VALIDATION: {
    CHECK_INTERVAL: 3600000, // 1 hour
    MAX_URLS: 50000,
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    SUBMISSION_TRACKING: true,
  },

  // Alert system
  ALERTS: {
    ENABLED: true,
    THROTTLING: {
      SAME_ALERT_INTERVAL: 3600000, // 1 hour
      MAX_ALERTS_PER_HOUR: 10,
    },
    SEVERITY_THRESHOLDS: {
      CRITICAL: {
        SEO_SCORE: 30,
        PERFORMANCE_SCORE: 30,
        CWV_FAILURES: 3,
        INDEXING_ERRORS: 10,
      },
      HIGH: {
        SEO_SCORE: 50,
        PERFORMANCE_SCORE: 50,
        CWV_FAILURES: 2,
        INDEXING_ERRORS: 5,
      },
      MEDIUM: {
        SEO_SCORE: 70,
        PERFORMANCE_SCORE: 70,
        CWV_FAILURES: 1,
        INDEXING_ERRORS: 2,
      },
    },
  },

  // Data collection endpoints
  ENDPOINTS: {
    GOOGLE_SEARCH_CONSOLE: 'https://www.googleapis.com/webmasters/v3',
    GOOGLE_PAGESPEED: 'https://www.googleapis.com/pagespeedonline/v5',
    STRUCTURED_DATA_TESTING: 'https://validator.schema.org',
    LIGHTHOUSE_CI: process.env.LIGHTHOUSE_CI_SERVER_BASE_URL,
  },

  // Storage configuration
  STORAGE: {
    REDIS_PREFIX: 'proweb_monitoring:',
    CACHE_TTL: {
      SEO_HEALTH: 3600, // 1 hour
      SEARCH_CONSOLE: 1800, // 30 minutes
      COMPETITOR_DATA: 86400, // 24 hours
      SITEMAP_DATA: 3600, // 1 hour
    },
  },

  // Notification channels
  NOTIFICATIONS: {
    EMAIL: {
      ENABLED: process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true',
      FROM: process.env.EMAIL_FROM || 'monitoring@proweb-studio.com',
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
    },
    WEBHOOK: {
      ENABLED: process.env.WEBHOOK_NOTIFICATIONS_ENABLED === 'true',
      URL: process.env.WEBHOOK_URL,
      SECRET: process.env.WEBHOOK_SECRET,
    },
    SLACK: {
      ENABLED: process.env.SLACK_NOTIFICATIONS_ENABLED === 'true',
      WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
      CHANNEL: process.env.SLACK_CHANNEL || '#monitoring',
    },
  },

  // Rate limiting
  RATE_LIMITS: {
    GOOGLE_API: {
      REQUESTS_PER_DAY: 25000,
      REQUESTS_PER_100_SECONDS: 100,
    },
    COMPETITOR_CRAWLING: {
      REQUESTS_PER_MINUTE: 60,
      CONCURRENT_REQUESTS: 5,
    },
  },

  // Security
  SECURITY: {
    API_KEY_HEADER: 'X-Monitoring-API-Key',
    REQUIRE_AUTH: process.env.NODE_ENV === 'production',
    ALLOWED_ORIGINS: [
      'https://proweb-studio.com',
      'https://www.proweb-studio.com',
      ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
    ],
  },

  // Feature flags
  FEATURES: {
    REAL_TIME_MONITORING: true,
    COMPETITOR_ANALYSIS: true,
    SMART_REDIRECTS: true,
    AUTOMATED_REPORTING: true,
    PREDICTIVE_ANALYTICS: false, // Future feature
  },
} as const;

// Environment-specific overrides
if (process.env.NODE_ENV === 'development') {
  // Reduce intervals for development
  Object.assign(MONITORING_CONFIG.CORE_WEB_VITALS, {
    COLLECTION_INTERVAL: 60000, // 1 minute
  });
  
  Object.assign(MONITORING_CONFIG.SEO_HEALTH, {
    CHECK_INTERVAL: 300000, // 5 minutes
  });
}

export type MonitoringConfig = typeof MONITORING_CONFIG;