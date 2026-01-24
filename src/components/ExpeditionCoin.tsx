"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";

export default function ExpeditionCoin() {
  const meshRef = useRef<THREE.Group>(null);
  
  // Rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
        {/* Coin Body - Gold */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2.5, 2.5, 0.2, 64]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={1}
          />
        </mesh>

        {/* Rim (Torus) */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.5, 0.15, 16, 100]} />
          <meshStandardMaterial
            color="#DAA520" // Goldenrod
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Inner detail ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#B8860B" // Dark Goldenrod
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Rocket Icon (Text) - Front */}
        <Text
          position={[0, 0.11, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={1.5}
          color="#B8860B"
          anchorX="center"
          anchorY="middle"
        >
          🚀
        </Text>
        
        {/* Currency Symbol - Back */}
         <Text
          position={[0, -0.11, 0]}
          rotation={[Math.PI / 2, 0, Math.PI]} // Rotate to be upright when flipped
          fontSize={1.8}
          color="#B8860B"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        >
          XP
        </Text>
      </group>
    </Float>
  );
}
