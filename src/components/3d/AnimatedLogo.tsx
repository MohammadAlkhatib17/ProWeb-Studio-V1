import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, useMatcapTexture, Float } from '@react-three/drei';
import { Group, Mesh } from 'three';

export function AnimatedLogo() {
  const group = useRef<Group>(null);
  const [matcapTexture] = useMatcapTexture('your-matcap-texture-here', 256);

  const fontProps = useMemo(
    () => ({
      font: '/path-to-your-font.woff',
      size: 1,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 5,
    }),
    []
  );

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={group}>
      <Center>
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <Text3D
            {...fontProps}
            matcap={matcapTexture}
          >
            ProWeb Studio
            <meshNormalMaterial attach="material" />
          </Text3D>
        </Float>
      </Center>
    </group>
  );
}