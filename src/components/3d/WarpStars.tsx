"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFlightStore } from "@/stores/useFlightStore";

export default function WarpStars() {
  const phase = useFlightStore((state) => state.phase);
  const meshRef = useRef<THREE.Points>(null);

  const count = 700;

  const [data, setData] = useState<{ positions: Float32Array; colors: Float32Array } | null>(null);

  useEffect(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color("#8b5cf6"), // Violet
      new THREE.Color("#3b82f6"), // Blue
      new THREE.Color("#06b6d4"), // Cyan
      new THREE.Color("#ffffff"), // White
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    // eslint-disable-next-line
    setData({ positions: pos, colors: col });
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Determine speed based on phase
    let speed = 0.05; // Base idle speed
    if (phase === 'launching') speed = 0.5;
    if (phase === 'warping') speed = 4.0; // HYPERDRIVE
    if (phase === 'orbit') speed = 0.5; // High speed cruise

    const positionsAttribute = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      // Move stars towards camera (positive Z) or away? Let's move them passing the camera
      // Let's assume camera is at 0,0,10 looking at 0,0,0
      // We want stars to streak past Z.

      let z = positionsAttribute.getY(i); // Using Y as Z for rotation trick or just direct Z

      // Actually standard Z movement
      z = positionsAttribute.getZ(i);
      z += speed;

      if (z > 50) {
        z = -100; // Reset far back
      }

      positionsAttribute.setZ(i, z);
    }

    positionsAttribute.needsUpdate = true;

    // Warping effect: stretch stars?
    // We can simulate stretch by scaling the container or using a shader.
    // Simple approach: rotation or basic movement for now.

    if (phase === 'warping') {
      meshRef.current.rotation.z += 0.02;
    } else if (phase === 'orbit') {
      meshRef.current.rotation.z += 0.005;
    } else {
      meshRef.current.rotation.z += 0.001;
    }
  });

  if (!data) return null;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          args={[data.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          args={[data.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
