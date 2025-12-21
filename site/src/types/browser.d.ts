/**
 * Browser API type declarations for non-standard APIs
 * These are experimental or vendor-specific APIs not in standard TypeScript lib
 */

interface NavigatorNetworkInformation {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
}

declare global {
    interface Navigator {
        deviceMemory?: number;
        connection?: NavigatorNetworkInformation;
        mozConnection?: NavigatorNetworkInformation;
        webkitConnection?: NavigatorNetworkInformation;
    }

    interface Performance {
        memory?: {
            jsHeapSizeLimit: number;
            totalJSHeapSize: number;
            usedJSHeapSize: number;
        };
    }

    interface Window {
        gtag?: (
            command: 'event' | 'config' | 'set',
            targetId: string,
            config?: Record<string, unknown>
        ) => void;
    }
}

export { };
