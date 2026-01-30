"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Trail, Sparkles, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFlightStore } from "@/stores/useFlightStore";

export default function RocketModel() {
  const rocketRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const engineStreamRef = useRef<THREE.Group>(null);
  const phase = useFlightStore((state) => state.phase);

  useFrame((state, delta) => {
    if (!rocketRef.current) return;
    const t = state.clock.elapsedTime;

    // Helper for smooth damping
    const damp = (current: number, target: number, smoothing: number) => {
      return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-smoothing * delta));
    };

    // --- SHARED BEHAVIOR ---
    // Subtle breathing rotation for liveliness
    rocketRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;

    // --- IDLE PHASE: Organic Floating ---
    if (phase === 'idle') {
      rocketRef.current.position.y = Math.sin(t * 0.5) * 0.1 + Math.sin(t * 1.5) * 0.05;
      rocketRef.current.rotation.x = Math.sin(t * 0.25) * 0.02; // slight pitch
      rocketRef.current.rotation.y = Math.PI / 2; // Default facing

      // Base scale reduced by 30% (0.8 * 0.7 = 0.56)
      rocketRef.current.scale.lerp(new THREE.Vector3(0.56, 0.56, 0.56), 1 - Math.exp(-2 * delta));

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
      // Progressive Tilt Up (Smooth exponential)
      rocketRef.current.rotation.x = damp(rocketRef.current.rotation.x, -Math.PI / 3, 1.5);
      rocketRef.current.position.y = damp(rocketRef.current.position.y, 1.5, 1.5);

      // Intense Rumble
      const rumble = 0.05;
      rocketRef.current.position.x = (Math.random() - 0.5) * rumble;
      rocketRef.current.position.z = (Math.random() - 0.5) * rumble;

      // Engine Flare
      if (glowRef.current && lightRef.current) {
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.8 + Math.random() * 0.2;
        lightRef.current.intensity = 8 + Math.random() * 5;
      }
    }

    // --- WARPING PHASE: Hyperdrive ---
    else if (phase === 'warping') {
      // Squash & Stretch (Elongate) - Fast reaction
      // Adjusted for new base scale (approx values)
      rocketRef.current.scale.y = damp(rocketRef.current.scale.y, 1.0, 3); // Length (was 1.5, scaled down)
      rocketRef.current.scale.x = damp(rocketRef.current.scale.x, 0.35, 3); // Thin (was 0.5, scaled down)
      rocketRef.current.scale.z = damp(rocketRef.current.scale.z, 0.35, 3); // Thin

      // High Frequency Shake
      rocketRef.current.position.x = (Math.random() - 0.5) * 0.2;
      rocketRef.current.position.y = (Math.random() - 0.5) * 0.2;

      // Blue Shift (Hyperdrive Color)
      if (glowRef.current && lightRef.current) {
        const blueColor = new THREE.Color("#3b82f6");
        const cyanColor = new THREE.Color("#06b6d4");
        // Flicker between blue and cyan
        (glowRef.current.material as THREE.MeshBasicMaterial).color.lerp(Math.random() > 0.5 ? blueColor : cyanColor, 0.5);
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 1;
        lightRef.current.color.set("#3b82f6");
        lightRef.current.intensity = 15;
      }
    }

    // --- ORBIT PHASE: Cruise Mode ---
    else if (phase === 'orbit') {
      rocketRef.current.position.y = damp(rocketRef.current.position.y, 0, 2);
      rocketRef.current.rotation.x = damp(rocketRef.current.rotation.x, 0, 2);

      // Return to new base scale
      rocketRef.current.scale.lerp(new THREE.Vector3(0.56, 0.56, 0.56), 1 - Math.exp(-3 * delta));

      // Cruise Engine
      if (glowRef.current && lightRef.current) {
        (glowRef.current.material as THREE.MeshBasicMaterial).color.set("#06b6d4"); // Cyan
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 10) * 0.1;
        lightRef.current.color.set("#06b6d4");
        lightRef.current.intensity = 3;
      }
    }
  });

  return (
    <group ref={rocketRef} rotation={[0, Math.PI / 2, 0]} scale={0.56}>
      <Float speed={phase === 'warping' ? 0 : 2} rotationIntensity={phase === 'warping' ? 0 : 0.5} floatIntensity={phase === 'warping' ? 0 : 0.5} enabled={phase === 'idle' || phase === 'orbit'}>

        {/* --- Main Fuselage --- */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.7, 4, 24]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* --- Mechanical Details (Rings) --- */}
        <mesh position={[0, 1.5, 0]}>
          <torusGeometry args={[0.52, 0.05, 16, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.5, 0]}>
          <torusGeometry args={[0.68, 0.08, 16, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* --- Cockpit Window (Glass) --- */}
        <group position={[0, 1, 0.45]} rotation={[0.1, 0, 0]}>
          <mesh>
            <capsuleGeometry args={[0.22, 0.8, 4, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <capsuleGeometry args={[0.18, 0.7, 4, 12]} />
            <meshPhysicalMaterial
              color="#0ea5e9"
              metalness={0.9}
              roughness={0.1}
              transmission={0.8}
              thickness={2}
              emissive="#0ea5e9"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>

        {/* --- Nose Cone --- */}
        <mesh position={[0, 2.5, 0]}>
          <coneGeometry args={[0.5, 1.2, 32]} />
          <meshPhysicalMaterial
            color="#ef4444"
            metalness={0.6}
            roughness={0.3}
            clearcoat={0.5}
          />
        </mesh>

        {/* --- Fins (Aerodynamic) --- */}
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
            <group position={[0.65, -1.5, 0]} rotation={[0, 0, -0.15]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.8, 1.8, 0.08]} />
                <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
              </mesh>
              {/* Fin Tip Light */}
              <mesh position={[0.4, -0.8, 0.05]}>
                <boxGeometry args={[0.1, 0.4, 0.02]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
              </mesh>
            </group>
          </group>
        ))}

        {/* --- Complex Engine Assembly --- */}
        <group position={[0, -2.1, 0]}>
          {/* Upper Housing */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.6, 0.5, 0.5, 24]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Nozzle */}
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.4, 0.6, 0.8, 24, 1, true]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
          {/* Inner Glow Core */}
          <mesh ref={glowRef} position={[0, -0.4, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <pointLight ref={lightRef} distance={5} decay={2} />
        </group>

        {/* --- Particle Effects (Exhaust) --- */}
        <group position={[0, -3.5, 0]} ref={engineStreamRef}>
          {/* Idle / Cruise Particles */}
          {(phase === 'idle' || phase === 'orbit') && (
            <Sparkles count={20} scale={1.5} size={2} speed={0.4} opacity={0.5} color="#60a5fa" noise={0.2} />
          )}

          {/* Launch / Warp Particles */}
          {(phase === 'launching' || phase === 'warping') && (
            <Sparkles
              count={100}
              scale={[1, 5, 1]}
              size={5}
              speed={2}
              opacity={0.8}
              color={phase === 'warping' ? "#60a5fa" : "#f97316"}
              noise={0.5}
            />
          )}
        </group>

        {/* --- High Speed Trail --- */}
        {(phase === 'launching' || phase === 'warping') && (
          <Trail width={2} length={6} color={phase === 'warping' ? "#3b82f6" : "#f97316"} attenuation={(t) => t * t}>
            <mesh position={[0, -2.5, 0]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial color={phase === 'warping' ? "#3b82f6" : "#f97316"} />
            </mesh>
          </Trail>
        )}

      </Float>
    </group>
  );
}
