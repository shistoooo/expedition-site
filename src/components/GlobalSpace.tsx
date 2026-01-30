"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PerspectiveCamera, Stars, Sparkles } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import RocketModel from "@/components/3d/RocketModel";
import WarpStars from "@/components/3d/WarpStars";
import { useFlightStore } from "@/stores/useFlightStore";
import * as THREE from "three";
import { usePathname } from "next/navigation";

function CameraController() {
  const phase = useFlightStore((state) => state.phase);
  const pathname = usePathname();
  const setPhase = useFlightStore((state) => state.setPhase);

  // Ref for camera lag smoothing
  const vec = new THREE.Vector3();

  // Reset phase when arriving at destination or direct access
  useEffect(() => {
    if (pathname === '/expedition') {
      if (phase === 'warping') {
        // Arrival from transition
        const timer = setTimeout(() => setPhase('orbit'), 800);
        return () => clearTimeout(timer);
      } else if (phase === 'idle') {
        // Direct access
        setPhase('orbit');
      }
    } else if (pathname === '/' && phase === 'orbit') {
      setPhase('idle');
    }
  }, [pathname, phase, setPhase]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Helper for smooth damping (frame independent)
    const damp = (current: number, target: number, smoothing: number) => {
      return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-smoothing * delta));
    };

    // Vector damp helper
    const dampVec = (current: THREE.Vector3, target: THREE.Vector3, smoothing: number) => {
      current.lerp(target, 1 - Math.exp(-smoothing * delta));
    };

    // --- IDLE: Gentle Float ---
    if (phase === 'idle') {
      const targetPos = new THREE.Vector3(
        Math.sin(t * 0.2) * 0.2,
        Math.cos(t * 0.3) * 0.2,
        8 + Math.sin(t * 0.1) * 0.5
      );
      dampVec(state.camera.position, targetPos, 2); // Smoothing factor 2

      state.camera.rotation.set(0, 0, 0);

      if (state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.fov = damp(state.camera.fov, 45, 2);
        state.camera.updateProjectionMatrix();
      }
    }

    // --- ORBIT: Cruise Mode (With Overshoot cleanup) ---
    else if (phase === 'orbit') {
      // Target: Matches idle phase for consistent size (Z=8)
      const targetPos = new THREE.Vector3(0, 0, 8);

      // Use lower smoothing for a "drift" effect (feels heavier)
      dampVec(state.camera.position, targetPos, 1.5);

      // Reset Camera Tilt with very slow damping (organic settle)
      state.camera.rotation.x = damp(state.camera.rotation.x, 0, 2);
      state.camera.rotation.y = damp(state.camera.rotation.y, 0, 2);

      // Slight banking follow (keeps it alive)
      state.camera.rotation.z = Math.sin(t * 0.5) * 0.02;

      if (state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.fov = damp(state.camera.fov, 45, 1.5); // Match idle FOV (45)
        state.camera.updateProjectionMatrix();
      }
    }

    // --- LAUNCHING: Camera Lag & Shake ---
    else if (phase === 'launching') {
      // Shake (High frequency noise)
      const shake = 0.08;
      state.camera.position.x += (Math.random() - 0.5) * shake;
      state.camera.position.y += (Math.random() - 0.5) * shake;

      // Pull back with HEAVY lag
      // We want the rocket to feel like it's leaving the camera behind
      const targetLag = new THREE.Vector3(0, -3, 14);
      dampVec(state.camera.position, targetLag, 0.8); // Very slow follow = heavy weight

      // Look slight up at the rocket
      state.camera.rotation.x = damp(state.camera.rotation.x, 0.2, 1);
    }

    // --- WARPING: Intense Speed Effect ---
    else if (phase === 'warping') {
      // Violent Shake
      const shake = 0.35;
      state.camera.position.x = (Math.random() - 0.5) * shake;
      state.camera.position.y = (Math.random() - 0.5) * shake;
      state.camera.rotation.z = (Math.random() - 0.5) * 0.05;

      // FOV Widen (Warp Speed tunneling)
      if (state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.fov = damp(state.camera.fov, 120, 3); // Fast expansion
        state.camera.updateProjectionMatrix();
      }

      // Camera sucked backward
      // We accept the camera might clip through geometry slightly for the effect
      state.camera.position.z = damp(state.camera.position.z, 5, 2);
    }
  });

  return null;
}

export default function GlobalSpace() {
  const pathname = usePathname();

  if (pathname === '/checkout') return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        performance={{ min: 0.5 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />

        <Suspense fallback={null}>
          <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Sparkles count={500} scale={20} size={4} speed={0.4} opacity={0.5} color="#8b5cf6" />
          <WarpStars />

          {/* We only show the rocket here if we want it persistent. 
              Ideally, the rocket is always there but moves position?
              Let's keep it simple: Rocket is always part of the global background now. 
          */}
          <RocketModel />
        </Suspense>

        <CameraController />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/20 to-[#0a0a0a] pointer-events-none" />
    </div>
  );
}
