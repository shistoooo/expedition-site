"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useFlightStore } from "@/stores/useFlightStore";

export default function RocketModel() {
  const rocketRef = useRef<THREE.Group>(null);
  const phase = useFlightStore((state) => state.phase);

  useFrame((state) => {
    if (!rocketRef.current) return;

    // Base Floating
    rocketRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    
    if (phase === 'idle') {
      // Gentle bobbing
      rocketRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
      rocketRef.current.rotation.x = 0;
    } 
    else if (phase === 'launching') {
      // Tilt up
      rocketRef.current.rotation.x = THREE.MathUtils.lerp(rocketRef.current.rotation.x, -Math.PI / 4, 0.02);
      rocketRef.current.position.y = THREE.MathUtils.lerp(rocketRef.current.position.y, 2, 0.02);
    }
    else if (phase === 'warping') {
      // Shake effect
      rocketRef.current.position.x = (Math.random() - 0.5) * 0.1;
      rocketRef.current.position.y = (Math.random() - 0.5) * 0.1;
    }
  });

  return (
    <group ref={rocketRef} rotation={[0, Math.PI / 2, 0]} scale={0.8}>
      <Float speed={phase === 'warping' ? 10 : 2} rotationIntensity={phase === 'warping' ? 0.1 : 0.5} floatIntensity={0.5}>
        
        {/* --- Main Fuselage --- */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.7, 4, 16]} />
          <meshStandardMaterial 
            color="#e2e8f0" 
            metalness={0.6} 
            roughness={0.3} 
          />
        </mesh>

        {/* --- Cockpit Window (Glass) --- */}
        <mesh position={[0, 1, 0.4]} rotation={[0.2, 0, 0]}>
          <capsuleGeometry args={[0.2, 0.6, 4, 8]} />
          <meshPhysicalMaterial 
            color="#3b82f6"
            metalness={0.9}
            roughness={0.1}
            transmission={0.5}
            thickness={1}
            emissive="#1d4ed8"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* --- Nose Cone --- */}
        <mesh position={[0, 2.5, 0]}>
          <coneGeometry args={[0.5, 1, 32]} />
          <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* --- Fins (Procedural Group) --- */}
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
            <mesh position={[0.6, -1.5, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.8, 1.5, 0.1]} />
              <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
            </mesh>
            {/* Fin details */}
            <mesh position={[0.9, -1.5, 0.05]} rotation={[0, 0, -0.2]}>
               <boxGeometry args={[0.1, 1, 0.05]} />
               <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
            </mesh>
          </group>
        ))}

        {/* --- Engines --- */}
        <group position={[0, -2.2, 0]}>
            {/* Main Thruster */}
            <mesh>
                <cylinderGeometry args={[0.3, 0.5, 0.5, 16]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Glow Core */}
            <mesh position={[0, -0.3, 0]}>
                 <sphereGeometry args={[0.25, 16, 16]} />
                 <meshBasicMaterial color="#f59e0b" />
            </mesh>
        </group>

        {/* --- Trail Effect (Only active when moving) --- */}
        {(phase === 'launching' || phase === 'warping') && (
           <Trail width={1.5} length={8} color="#f59e0b" attenuation={(t) => t * t}>
              <mesh position={[0, -2.5, 0]}>
                  <sphereGeometry args={[0.1, 16, 16]} />
                  <meshBasicMaterial color="orange" />
              </mesh>
           </Trail>
        )}

      </Float>
    </group>
  );
}
