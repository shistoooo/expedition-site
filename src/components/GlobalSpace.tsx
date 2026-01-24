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

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // --- IDLE: Gentle Float ---
    if (phase === 'idle') {
      const targetPos = new THREE.Vector3(
        Math.sin(t * 0.2) * 0.2, 
        Math.cos(t * 0.3) * 0.2, 
        8 + Math.sin(t * 0.1) * 0.5
      );
      state.camera.position.lerp(targetPos, 0.02);
      state.camera.rotation.set(0, 0, 0);
      if (state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 45, 0.05);
        state.camera.updateProjectionMatrix();
      }
    } 
    
    // --- ORBIT: Cruise Mode ---
    else if (phase === 'orbit') {
      // Stable high speed flight
      const targetPos = new THREE.Vector3(0, 0, 9); // Slightly further back
      state.camera.position.lerp(targetPos, 0.05);
      
      // Slight banking follow
      state.camera.rotation.z = Math.sin(t * 0.5) * 0.02;
      
      if (state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 55, 0.05); // Wider FOV for speed
        state.camera.updateProjectionMatrix();
      }
    }
    
    // --- LAUNCHING: Shake & Pullback ---
    else if (phase === 'launching') {
      // Shake
      const shake = 0.05;
      state.camera.position.x += (Math.random() - 0.5) * shake;
      state.camera.position.y += (Math.random() - 0.5) * shake;
      
      // Pull back
      state.camera.position.lerp(new THREE.Vector3(0, -2, 10), 0.02);
    } 
    
    // --- WARPING: Speed Effect ---
    else if (phase === 'warping') {
      // Intense Shake
      const shake = 0.2;
      state.camera.position.x = (Math.random() - 0.5) * shake;
      state.camera.position.y = (Math.random() - 0.5) * shake;
      
      // FOV Widen (Warp Speed feeling)
      if (state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 100, 0.05);
        state.camera.updateProjectionMatrix();
      }
    }
  });
  
  return null;
}

export default function GlobalSpace() {
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
