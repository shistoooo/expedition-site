'use client';

import { useAvatarStore } from '@/stores/useAvatarStore';
import { useRef } from 'react';
import * as THREE from 'three';

// Placeholder Part Components (Will be replaced by GLTF loaders)
const Helmet = ({ variant, color }: { variant: string; color: string }) => (
    <group position={[0, 1.6, 0]}>
        <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.26]}>
            <planeGeometry args={[0.3, 0.2]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
    </group>
);

const Torso = ({ variant, color }: { variant: string; color: string }) => (
    <group position={[0, 0.9, 0]}>
        <mesh castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.9, 0.4]} />
            <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
    </group>
);

const Backpack = ({ variant, color }: { variant: string; color: string }) => (
    <group position={[0, 1, -0.25]}>
        <mesh castShadow receiveShadow>
            <boxGeometry args={[0.4, 0.6, 0.3]} />
            <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        {/* Thrusters */}
        <mesh position={[-0.1, -0.35, 0]}>
            <cylinderGeometry args={[0.05, 0.08, 0.3]} />
            <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.1, -0.35, 0]}>
            <cylinderGeometry args={[0.05, 0.08, 0.3]} />
            <meshStandardMaterial color="#334155" />
        </mesh>
    </group>
);

export default function Avatar() {
    const { config } = useAvatarStore();

    return (
        <group dispose={null}>
            {/* Assemblage des parties : LEGO System */}
            <Helmet variant={config.helmet} color={config.colors.primary} />
            <Torso variant={config.suit} color={config.colors.secondary} />
            <Backpack variant={config.backpack} color={config.colors.secondary} />

            {/* Legs (Static for now) */}
            <group position={[0, 0, 0]}>
                <mesh position={[-0.15, 0.45, 0]} castShadow>
                    <boxGeometry args={[0.2, 0.9, 0.25]} />
                    <meshStandardMaterial color={config.colors.secondary} />
                </mesh>
                <mesh position={[0.15, 0.45, 0]} castShadow>
                    <boxGeometry args={[0.2, 0.9, 0.25]} />
                    <meshStandardMaterial color={config.colors.secondary} />
                </mesh>
            </group>
        </group>
    );
}
