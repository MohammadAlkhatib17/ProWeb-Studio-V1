import { Canvas } from '@react-three/fiber';
import { Suspense, lazy } from 'react';
import { MotionConfig } from 'framer-motion';

// Lazy load heavy 3D components
const AnimatedLogo = lazy(() => import('./AnimatedLogo'));

export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10">
      <MotionConfig transition={{ duration: 0.8, ease: 'easeInOut' }}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          className="bg-gradient-to-b from-gray-900 via-gray-950 to-black"
        >
          <Suspense fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="#4F46E5" />
            </mesh>
          }>
            <AnimatedLogo />
          </Suspense>
        </Canvas>
      </MotionConfig>
    </div>
  );
}
