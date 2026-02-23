'use client';

import AvatarCanvas from '@/components/avatar/AvatarCanvas';
import EditorUI from '@/components/avatar/editor/EditorUI';

export default function AvatarPage() {
    return (
        <div className="w-full h-screen bg-black flex text-white overflow-hidden">
            {/* Zone 3D (Gauche/Centre) */}
            <div className="flex-1 relative">
                <AvatarCanvas />
            </div>

            {/* Zone Éditeur (Droite) */}
            <div className="w-96 border-l border-white/10 bg-slate-900/50 backdrop-blur-xl p-6">
                <h1 className="text-2xl font-bold mb-6 font-mono tracking-widest text-cyan-400">
                    ARMORY // AVATAR
                </h1>
                <EditorUI />
            </div>
        </div>
    );
}
