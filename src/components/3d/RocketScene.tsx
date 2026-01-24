"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Stars, Sparkles } from "@react-three/drei";
import { Suspense } from "react";
import RocketModel from "./RocketModel";

export default function RocketScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#8b5cf6" />
          
          <RocketModel />
        </Suspense>
      </Canvas>
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] pointer-events-none" />
    </div>
  );
}
