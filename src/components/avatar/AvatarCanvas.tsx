'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Environment } from '@react-three/drei';
import Avatar from './Avatar';
import { Suspense } from 'react';

export default function AvatarCanvas() {
    return (
        <div className="w-full h-full min-h-[500px] bg-slate-900 rounded-xl overflow-hidden relative">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.6}>
                        <Avatar />
                    </Stage>
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.9} />
                </Suspense>
            </Canvas>

            {/* Loading Overlay (Optional) */}
            <div className="absolute top-4 left-4 pointer-events-none">
                <h3 className="text-white/50 text-xs font-mono">AVATAR PREVIEW // R3F</h3>
            </div>
        </div>
    );
}
