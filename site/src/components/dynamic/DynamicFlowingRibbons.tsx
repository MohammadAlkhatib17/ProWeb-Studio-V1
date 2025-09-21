'use client';

import dynamic from 'next/dynamic';

const FlowingRibbons = dynamic(() => import('@/three/FlowingRibbons'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-cosmic-900/50 animate-pulse" />
});

export default function DynamicFlowingRibbons() {
  return <FlowingRibbons />;
}