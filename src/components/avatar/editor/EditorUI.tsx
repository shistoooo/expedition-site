'use client';

import { useAvatarStore, AvatarConfig } from '@/stores/useAvatarStore';

const PARTS = [
    { id: 'helmet', label: 'HEADGEAR' },
    { id: 'suit', label: 'EXO-SUIT' },
    { id: 'backpack', label: 'THRUSTERS' },
];

const COLORS = [
    { hex: '#ffffff', label: 'Arctic' },
    { hex: '#ef4444', label: 'Mars Red' },
    { hex: '#3b82f6', label: 'Deep Space' },
    { hex: '#fbbf24', label: 'Solar Gold' },
    { hex: '#10b981', label: 'Bio-Green' },
    { hex: '#6366f1', label: 'Nebula' },
    { hex: '#1e293b', label: 'Stealth' },
];

export default function EditorUI() {
    const { config, setPart, setColor } = useAvatarStore();

    return (
        <div className="flex flex-col gap-8">
            {/* SECTION 1: PARTS */}
            <div>
                <h2 className="text-sm font-bold text-slate-400 mb-4 border-b border-slate-700/50 pb-2">
                    MODULES
                </h2>
                <div className="space-y-4">
                    {PARTS.map((part) => (
                        <div key={part.id}>
                            <label className="text-xs text-cyan-500 block mb-2">{part.label}</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Option A', 'Option B', 'Option C'].map((opt, i) => (
                                    <button
                                        key={opt}
                                        onClick={() => setPart(part.id as keyof Pick<AvatarConfig, 'helmet' | 'suit' | 'backpack'>, `${part.id}_v${i + 1}`)}
                                        className={`
                      h-12 rounded bg-slate-800 border-2 transition-all
                      ${config[part.id as keyof AvatarConfig] === `${part.id}_v${i + 1}`
                                                ? 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                                                : 'border-transparent hover:border-slate-600'}
                    `}
                                    >
                                        <span className="text-[10px] uppercase text-slate-500 font-mono">
                                            MK-{i + 1}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION 2: PAINTS */}
            <div>
                <h2 className="text-sm font-bold text-slate-400 mb-4 border-b border-slate-700/50 pb-2">
                    NANO-COATING
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-cyan-500 block mb-2">PRIMARY LAYER</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c.hex}
                                    onClick={() => setColor('primary', c.hex)}
                                    className={`
                    w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                    ${config.colors.primary === c.hex ? 'border-white scale-110' : 'border-transparent'}
                  `}
                                    style={{ backgroundColor: c.hex }}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-cyan-500 block mb-2">SECONDARY LAYER</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c.hex}
                                    onClick={() => setColor('secondary', c.hex)}
                                    className={`
                    w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                    ${config.colors.secondary === c.hex ? 'border-white scale-110' : 'border-transparent'}
                  `}
                                    style={{ backgroundColor: c.hex }}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="mt-8 pt-6 border-t border-white/10">
                <button
                    className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold tracking-wider rounded transition-colors uppercase font-mono"
                >
                    Initialize Suit
                </button>
            </div>
        </div>
    );
}
