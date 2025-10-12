// Monitoring system initialization script
// Add this to your app layout or main page to start monitoring

import { useEffect } from "react";

export function MonitoringProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize client-side monitoring
    if (typeof window !== "undefined") {
      import("@/lib/monitoring/client-tracking").catch(console.error);
    }
  }, []);

  return <>{children}</>;
}
