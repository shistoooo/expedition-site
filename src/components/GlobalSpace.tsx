"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import RocketModel from "@/components/3d/RocketModel";
import WarpStars from "@/components/3d/WarpStars";
import { useFlightStore } from "@/stores/useFlightStore";
import * as THREE from "three";
import { usePathname } from "next/navigation";

function CameraController() {
  const phase = useFlightStore((state) => state.phase);
  const pathname = usePathname();
  const setPhase = useFlightStore((state) => state.setPhase);
  
  useFrame((state) => {
    // Camera Logic based on Phase
    if (phase === 'idle') {
      // Normal view
      state.camera.position.lerp(new THREE.Vector3(0, 0, 8), 0.05);
    } else if (phase === 'launching') {
      // Pull back slightly
      state.camera.position.lerp(new THREE.Vector3(0, -2, 10), 0.02);
    } else if (phase === 'warping') {
      // Shakey cam effect ?
      // state.camera.position.x = (Math.random() - 0.5) * 0.1;
    }

    // Reset phase if we are on expedition page
    if (pathname === '/expedition' && phase === 'warping') {
       setTimeout(() => setPhase('idle'), 1000); // Cooldown
    }
  });
  
  return null;
}

export default function GlobalSpace() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
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
