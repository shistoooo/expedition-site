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
      // Steady rotation on Y axis to show 3D depth
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  // Shared materials
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: "#FFD700",
    metalness: 0.9,
    roughness: 0.15,
  });

  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: "#DAA520", // Slightly darker for contrast
    metalness: 0.8,
    roughness: 0.3,
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef}>
        
        {/* 1. The Coin Edge (Main Cylinder) */}
        {/* Rotated 90deg on X to face Z axis */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2, 2, 0.25, 128]} /> 
          <primitive object={edgeMaterial} />
        </mesh>

        {/* 2. The Faces (Top and Bottom covers to hide the cylinder caps if we want different mat, 
            but actually we can just put the text on top. 
            To create the "Rim" effect, we use Torus rings on both sides) */}

        {/* Front Rim */}
        <mesh position={[0, 0, 0.125]}>
          <torusGeometry args={[2, 0.08, 16, 64]} />
          <primitive object={goldMaterial} />
        </mesh>

        {/* Back Rim */}
        <mesh position={[0, 0, -0.125]}>
          <torusGeometry args={[2, 0.08, 16, 64]} />
          <primitive object={goldMaterial} />
        </mesh>

        {/* Front Face Background (Recessed) */}
        <mesh position={[0, 0, 0.12]} rotation={[0, 0, 0]}>
          <circleGeometry args={[1.92, 64]} />
          <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Back Face Background (Recessed) */}
        <mesh position={[0, 0, -0.12]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[1.92, 64]} />
          <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* 3. The Content */}
        
        {/* Front: Rocket */}
        <Text
          position={[0, 0, 0.14]} // Just above the face
          fontSize={1.4}
          color="#B8860B" // Dark Gold/Bronze for contrast
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#FFF"
          outlineOpacity={0.5}
        >
          🚀
        </Text>
        
        {/* Back: XP Symbol */}
        <Text
          position={[0, 0, -0.14]}
          rotation={[0, Math.PI, 0]}
          fontSize={1.6}
          color="#B8860B"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          fontWeight="bold"
          outlineWidth={0.02}
          outlineColor="#FFF"
          outlineOpacity={0.5}
        >
          XP
        </Text>

      </group>
    </Float>
  );
}
