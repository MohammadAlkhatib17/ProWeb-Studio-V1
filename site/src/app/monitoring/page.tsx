import SEOHealthDashboard from '@/components/monitoring/SEOHealthDashboard';

export default function MonitoringPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <SEOHealthDashboard />
      </div>
    </div>
  );
}