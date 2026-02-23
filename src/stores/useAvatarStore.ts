import { create } from 'zustand';

export interface AvatarConfig {
    helmet: string;
    suit: string;
    backpack: string;
    colors: {
        primary: string;
        secondary: string;
        visor: string;
        glow: string;
    };
}

interface AvatarState {
    config: AvatarConfig;
    setPart: (part: keyof Pick<AvatarConfig, 'helmet' | 'suit' | 'backpack'>, assetId: string) => void;
    setColor: (zone: keyof AvatarConfig['colors'], color: string) => void;
}

const DEFAULT_CONFIG: AvatarConfig = {
    helmet: 'helmet_default',
    suit: 'suit_default',
    backpack: 'backpack_default',
    colors: {
        primary: '#ffffff',
        secondary: '#3b82f6', // blue-500
        visor: '#fbbf24',    // amber-400
        glow: '#3b82f6',
    },
};

export const useAvatarStore = create<AvatarState>((set) => ({
    config: DEFAULT_CONFIG,
    setPart: (part, assetId) =>
        set((state) => ({
            config: { ...state.config, [part]: assetId },
        })),
    setColor: (zone, color) =>
        set((state) => ({
            config: {
                ...state.config,
                colors: { ...state.config.colors, [zone]: color },
            },
        })),
}));
