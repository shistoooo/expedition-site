"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Stars, Trail } from "@react-three/drei";
import * as THREE from "three";

function Rocket() {
  const rocketRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rocketRef.current) {
      // Gentle floating rotation
      rocketRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      rocketRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={rocketRef} rotation={[0, 0, Math.PI / 4]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Main Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.6, 3, 32]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} emissive="#6d28d9" emissiveIntensity={0.5} />
        </mesh>

        {/* Nose Cone */}
        <mesh position={[0, 2, 0]}>
          <coneGeometry args={[0.4, 1, 32]} />
          <meshStandardMaterial color="#f472b6" metalness={0.8} roughness={0.2} emissive="#db2777" emissiveIntensity={0.5} />
        </mesh>

        {/* Fins */}
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
            <mesh position={[0.6, -1, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.8, 1.5, 0.1]} />
              <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Engine Glow */}
        <mesh position={[0, -1.6, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 0.5, 32]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        
        {/* Particle Trail Placeholder (Visualized as a simple glow for now) */}
        <pointLight position={[0, -2, 0]} color="#ef4444" intensity={2} distance={5} />
      </Float>
    </group>
  );
}

export default function RocketScene() {
  return (
    <div className="w-full h-[600px] md:h-[800px] absolute top-0 left-0 -z-10">
      {/* We need to import Canvas dynamically in the parent or ensure this component is only rendered client-side 
          But since we are inside "use client", we can use Canvas here if we import it. 
          However, usually it's better to keep the Canvas in a separate file or import R3F components.
      */}
    </div>
  );
}
