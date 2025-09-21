'use client';

import dynamic from 'next/dynamic';

const OrbitSystem = dynamic(() => import('@/three/OrbitSystem'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-cosmic-900/30" />
});

export default function DynamicOrbitSystem() {
  return <OrbitSystem />;
}