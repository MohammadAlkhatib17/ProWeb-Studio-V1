'use client';

import { useRef, useMemo } from 'react';

import { Sphere, Trail, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import Scene3D from '@/components/Scene3D';

interface PlanetProps {
  radius: number;
  speed: number;
  distance: number;
  color: string;
  inclination: number; // Angle in radians
  phase: number; // Starting position
}

function Planet({ radius, speed, distance, color, inclination, phase }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);

  // Calculate orbit path for the Line component
  const orbitPath = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      // Apply inclination rotation
      const y = z * Math.sin(inclination);
      // Adjust z for inclination
      const zRotated = z * Math.cos(inclination);
      points.push(new THREE.Vector3(x, y, zRotated));
    }
    return points;
  }, [distance, inclination]);

  useFrame((state) => {
    if (planetRef.current) {
      const t = state.clock.elapsedTime * speed + phase;
      const x = Math.cos(t) * distance;
      const z = Math.sin(t) * distance;

      // Apply inclination
      const y = z * Math.sin(inclination);
      const zRotated = z * Math.cos(inclination);

      planetRef.current.position.set(x, y, zRotated);
    }
  });

  return (
    <group>
      {/* Orbital Ring */}
      <Line
        points={orbitPath}
        color={color}
        opacity={0.15}
        transparent
        lineWidth={1}
      />

      {/* Planet with Trail */}
      <Trail width={3} length={8} color={color} attenuation={(t) => t * t}>
        <Sphere
          ref={planetRef}
          args={[radius, 32, 16]}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
          />
        </Sphere>
      </Trail>
    </group>
  );
}

export default function OrbitSystem() {
  return (
    <Scene3D adaptive={false}>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffaa00" decay={2} distance={10} />

      {/* Central Sun - Much Larger & Brighter */}
      <Sphere args={[1.2, 64, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffcc00"
          emissiveIntensity={1.5}
        />
      </Sphere>

      {/* Glow Halo around Sun */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#ffaa00" distance={3} />

      {/* Creative Orbiting Planets */}
      <Planet radius={0.15} speed={0.8} distance={2.2} color="#00ffff" inclination={0.2} phase={0} />
      <Planet radius={0.25} speed={0.5} distance={3.0} color="#ff00ff" inclination={-0.3} phase={2} />
      <Planet radius={0.12} speed={1.2} distance={3.8} color="#4da6ff" inclination={0.5} phase={4} />
      <Planet radius={0.18} speed={0.6} distance={4.5} color="#00ff88" inclination={-0.1} phase={1} />

      {/* Distant slower planet */}
      <Planet radius={0.22} speed={0.3} distance={6.0} color="#ffdd00" inclination={0.1} phase={5} />

    </Scene3D>
  );
}
