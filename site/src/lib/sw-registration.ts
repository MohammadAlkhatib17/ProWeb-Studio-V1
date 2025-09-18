/**
 * Non-intrusive Service Worker Registration Utility
 * 
 * This utility handles service worker registration for PWA functionality
 * with production-only and same-origin safety checks. It runs silently
 * without affecting the UI or user experience.
 */

interface ServiceWorkerRegistrationOptions {
  scope?: string;
  updateViaCache?: 'imports' | 'all' | 'none';
}

class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private isRegistered = false;
  private registration: ServiceWorkerRegistration | null = null;
  private readonly SW_PATH = '/sw.js';
  
  private constructor() {}
  
  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  /**
   * Check if service workers are supported and conditions are met for registration
   */
  private canRegisterServiceWorker(): boolean {
    // Only register in production environment
    if (process.env.NODE_ENV !== 'production') {
      console.log('SW: Registration skipped - not in production');
      return false;
    }

    // Check browser support
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('SW: Registration skipped - no browser support');
      return false;
    }

    // Ensure same-origin policy
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      console.log('SW: Registration skipped - not HTTPS or localhost');
      return false;
    }

    return true;
  }

  /**
   * Register the service worker with error handling and logging
   */
  async register(options: ServiceWorkerRegistrationOptions = {}): Promise<ServiceWorkerRegistration | null> {
    if (this.isRegistered) {
      return this.registration;
    }

    if (!this.canRegisterServiceWorker()) {
      return null;
    }

    try {
      const defaultOptions: ServiceWorkerRegistrationOptions = {
        scope: '/',
        updateViaCache: 'none',
        ...options,
      };

      console.log('SW: Attempting registration...');
      
      this.registration = await navigator.serviceWorker.register(this.SW_PATH, defaultOptions);
      this.isRegistered = true;

      // Handle service worker updates
      this.registration.addEventListener('updatefound', () => {
        console.log('SW: Update found, installing new version');
        const newWorker = this.registration?.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('SW: New version available, will activate on next visit');
            }
          });
        }
      });

      // Log registration success
      if (this.registration.installing) {
        console.log('SW: Installing...');
      } else if (this.registration.waiting) {
        console.log('SW: Waiting to activate...');
      } else if (this.registration.active) {
        console.log('SW: Active and running');
      }

      return this.registration;
    } catch (error) {
      console.error('SW: Registration failed:', error);
      this.isRegistered = false;
      this.registration = null;
      return null;
    }
  }

  /**
   * Unregister the service worker (primarily for debugging)
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const success = await this.registration.unregister();
      if (success) {
        this.isRegistered = false;
        this.registration = null;
        console.log('SW: Successfully unregistered');
      }
      return success;
    } catch (error) {
      console.error('SW: Unregistration failed:', error);
      return false;
    }
  }

  /**
   * Get the current registration status
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  /**
   * Check if service worker is registered
   */
  isServiceWorkerRegistered(): boolean {
    return this.isRegistered;
  }
}

/**
 * Initialize service worker registration
 * This function should be called once when the application loads
 */
export async function initializeServiceWorker(): Promise<void> {
  if (typeof window === 'undefined') {
    return; // Skip on server-side
  }

  // Wait for the page to be fully loaded to avoid interfering with critical rendering
  if (document.readyState === 'loading') {
    await new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    });
  }

  // Small delay to ensure the main thread is not blocked
  await new Promise(resolve => setTimeout(resolve, 100));

  const swManager = ServiceWorkerManager.getInstance();
  await swManager.register();
}

/**
 * Export the service worker manager for advanced usage
 */
export const serviceWorkerManager = ServiceWorkerManager.getInstance();

/**
 * Utility function to check if PWA is installable
 */
export function isPWAInstallable(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      resolve(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt, { once: true });

    // Timeout after 2 seconds
    setTimeout(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      resolve(false);
    }, 2000);
  });
}

export default ServiceWorkerManager;