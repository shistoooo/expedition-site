"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useFlightStore } from "@/stores/useFlightStore";

export default function RocketModel() {
  const rocketRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const phase = useFlightStore((state) => state.phase);

  useFrame((state) => {
    if (!rocketRef.current) return;
    const t = state.clock.elapsedTime;

    // --- IDLE PHASE: Organic Floating ---
    if (phase === 'idle') {
      // Smooth multi-axis floating
      rocketRef.current.position.y = Math.sin(t * 0.5) * 0.1 + Math.sin(t * 1.5) * 0.05;
      rocketRef.current.position.x = Math.cos(t * 0.3) * 0.05;
      rocketRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
      rocketRef.current.rotation.x = Math.sin(t * 0.25) * 0.02; // slight pitch
      rocketRef.current.rotation.y = Math.PI / 2; // Default facing

      // Reset Scale
      rocketRef.current.scale.lerp(new THREE.Vector3(0.8, 0.8, 0.8), 0.1);

      // Gentle engine pulse
      if (glowRef.current && lightRef.current) {
        const pulse = 0.5 + Math.sin(t * 3) * 0.2;
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
        (glowRef.current.material as THREE.MeshBasicMaterial).color.set("#f59e0b"); // Orange
        lightRef.current.intensity = pulse * 2;
        lightRef.current.color.set("#ef4444");
      }
    } 
    
    // --- LAUNCHING PHASE: Ignition & Tilt ---
    else if (phase === 'launching') {
      // Progressive Tilt Up
      rocketRef.current.rotation.x = THREE.MathUtils.lerp(rocketRef.current.rotation.x, -Math.PI / 3, 0.04);
      rocketRef.current.position.y = THREE.MathUtils.lerp(rocketRef.current.position.y, 1.5, 0.04);
      
      // Rumble / Vibration
      const rumble = 0.02;
      rocketRef.current.position.x = (Math.random() - 0.5) * rumble;
      rocketRef.current.position.z = (Math.random() - 0.5) * rumble;

      // Engine Flare
      if (glowRef.current && lightRef.current) {
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.8 + Math.random() * 0.2;
        lightRef.current.intensity = 5 + Math.random() * 2;
      }
    }
    
    // --- WARPING PHASE: Hyperdrive ---
    else if (phase === 'warping') {
      // Squash & Stretch (Elongate)
      rocketRef.current.scale.y = THREE.MathUtils.lerp(rocketRef.current.scale.y, 1.2, 0.1); // Length
      rocketRef.current.scale.x = THREE.MathUtils.lerp(rocketRef.current.scale.x, 0.6, 0.1); // Thin
      rocketRef.current.scale.z = THREE.MathUtils.lerp(rocketRef.current.scale.z, 0.6, 0.1); // Thin

      // High Frequency Shake
      rocketRef.current.position.x = (Math.random() - 0.5) * 0.15;
      rocketRef.current.position.y = (Math.random() - 0.5) * 0.15;

      // Blue Shift (Hyperdrive Color)
      if (glowRef.current && lightRef.current) {
        (glowRef.current.material as THREE.MeshBasicMaterial).color.setHex(0x3b82f6); // Blue
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 1;
        lightRef.current.color.setHex(0x3b82f6);
        lightRef.current.intensity = 8;
      }
    }

    // --- ORBIT PHASE: Cruise Mode (Arrival) ---
    else if (phase === 'orbit') {
      // Stabilize Position
      rocketRef.current.position.y = THREE.MathUtils.lerp(rocketRef.current.position.y, 0, 0.05);
      rocketRef.current.position.x = THREE.MathUtils.lerp(rocketRef.current.position.x, 0, 0.05);
      
      // Gentle Cruise Rotation
      rocketRef.current.rotation.x = THREE.MathUtils.lerp(rocketRef.current.rotation.x, 0, 0.05);
      rocketRef.current.rotation.z += 0.005; // Slow roll
      
      // Reset Scale
      rocketRef.current.scale.lerp(new THREE.Vector3(0.8, 0.8, 0.8), 0.05);

      // Cruise Engine (Cyan/White)
      if (glowRef.current && lightRef.current) {
        (glowRef.current.material as THREE.MeshBasicMaterial).color.set("#06b6d4"); // Cyan
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 2) * 0.1;
        lightRef.current.color.set("#06b6d4");
        lightRef.current.intensity = 3;
      }
    }
  });

  return (
    <group ref={rocketRef} rotation={[0, Math.PI / 2, 0]} scale={0.8}>
      <Float speed={phase === 'warping' ? 0 : 2} rotationIntensity={phase === 'warping' ? 0 : 0.5} floatIntensity={phase === 'warping' ? 0 : 0.5} enabled={phase === 'idle' || phase === 'orbit'}>
        
        {/* --- Main Fuselage --- */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.7, 4, 12]} />
          <meshStandardMaterial 
            color="#e2e8f0" 
            metalness={0.6} 
            roughness={0.3} 
          />
        </mesh>

        {/* --- Cockpit Window (Glass) --- */}
        <mesh position={[0, 1, 0.4]} rotation={[0.2, 0, 0]}>
          <capsuleGeometry args={[0.2, 0.6, 2, 6]} />
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
          <coneGeometry args={[0.5, 1, 16]} />
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
                <cylinderGeometry args={[0.3, 0.5, 0.5, 12]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Glow Core */}
            <mesh position={[0, -0.3, 0]}>
                 <sphereGeometry args={[0.25, 12, 12]} />
                 <meshBasicMaterial color="#f59e0b" />
            </mesh>
        </group>

        {/* --- Trail Effect (Only active when moving) --- */}
        {(phase === 'launching' || phase === 'warping') && (
           <Trail width={1.5} length={8} color="#f59e0b" attenuation={(t) => t * t}>
              <mesh position={[0, -2.5, 0]}>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshBasicMaterial color="orange" />
              </mesh>
           </Trail>
        )}

      </Float>
    </group>
  );
}
