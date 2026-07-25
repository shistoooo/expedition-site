"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Stars, Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import WarpStars from "@/components/3d/WarpStars";
import { useFlightStore } from "@/stores/useFlightStore";
import * as THREE from "three";
import { usePathname } from "next/navigation";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

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
  const isDesktop = useIsDesktop();

  const EXCLUDED_ROUTES = ['/checkout', '/checkout/success', '/coin-green-screen', '/avatar-editor'];
  // /admin = panneau de données → fond uni, aucun décor spatial
  if (EXCLUDED_ROUTES.includes(pathname) || pathname?.startsWith('/admin')) return null;

  // /swipeforge : mêmes étoiles animées, densité réduite (moins chargé qu'ailleurs)
  const isLowDensity = pathname === '/swipeforge';
  const starsCount = isLowDensity ? 450 : 2000;
  const sparklesCount = isLowDensity ? 35 : 200;

  // Mobile: lightweight static background instead of 3D canvas
  if (!isDesktop) {
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.05)_0%,transparent_50%)]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[1]">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        performance={{ min: 0.5 }}
        style={{ pointerEvents: "none" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />

        <Suspense fallback={null}>
          <Stars radius={300} depth={50} count={starsCount} factor={3} saturation={0} fade speed={0.8} />
          <Sparkles count={sparklesCount} scale={20} size={3} speed={0.3} opacity={0.4} color="#8b5cf6" />
          <WarpStars />
        </Suspense>

        <CameraController />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#06051a]/40 pointer-events-none" />
    </div>
  );
}
