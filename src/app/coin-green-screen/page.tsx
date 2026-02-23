"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import ExpeditionCoin from "@/components/ExpeditionCoin";

export default function CoinGreenScreen() {
    return (
        <div className="w-screen h-screen bg-[#00ff00] overflow-hidden">
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffd700" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff8c00" />

                    <ExpeditionCoin />

                    {/* Optional: Add shadows if desired, but for green screen usually you want clean cutout. 
                Shadows on green screen can be tricky to key out if they are dark. 
                I will comment out ContactShadows for a cleaner key, or keep them if they want the ground shadow.
                User said "piece edition en gif", usually implies the object itself.
                I'll leave it out for a cleaner "sticker" like usage.
            */}
                    {/* <ContactShadows
              position={[0, -2, 0]}
              opacity={0.4}
              scale={10}
              blur={2.5}
              far={4}
            /> */}
                </Suspense>
            </Canvas>
        </div>
    );
}
