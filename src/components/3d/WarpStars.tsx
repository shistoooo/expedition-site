"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFlightStore } from "@/stores/useFlightStore";

export default function WarpStars() {
  const phase = useFlightStore((state) => state.phase);
  const meshRef = useRef<THREE.Points>(null);
  
  const count = 2000;
  
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      initPos[i * 3] = x;
      initPos[i * 3 + 1] = y;
      initPos[i * 3 + 2] = z;
    }
    return [pos, initPos];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Determine speed based on phase
    let speed = 0.05; // Base idle speed
    if (phase === 'launching') speed = 0.5;
    if (phase === 'warping') speed = 4.0; // HYPERDRIVE
    if (phase === 'orbit') speed = 0.2;

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
    } else {
       meshRef.current.rotation.z += 0.001;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}
