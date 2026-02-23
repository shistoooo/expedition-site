import { describe, it, expect, beforeEach } from 'vitest';
import { useAvatarStore } from '@/stores/useAvatarStore';

describe('useAvatarStore', () => {
  beforeEach(() => {
    // Reset store to defaults
    useAvatarStore.setState({
      config: {
        helmet: 'helmet_default',
        suit: 'suit_default',
        backpack: 'backpack_default',
        colors: {
          primary: '#ffffff',
          secondary: '#3b82f6',
          visor: '#fbbf24',
          glow: '#3b82f6',
        },
      },
    });
  });

  it('should have correct default config', () => {
    const { config } = useAvatarStore.getState();
    expect(config.helmet).toBe('helmet_default');
    expect(config.suit).toBe('suit_default');
    expect(config.backpack).toBe('backpack_default');
    expect(config.colors.primary).toBe('#ffffff');
  });

  it('should update a part', () => {
    const { setPart } = useAvatarStore.getState();
    setPart('helmet', 'helmet_v2');
    expect(useAvatarStore.getState().config.helmet).toBe('helmet_v2');
  });

  it('should not affect other parts when updating one', () => {
    const { setPart } = useAvatarStore.getState();
    setPart('helmet', 'helmet_v3');
    expect(useAvatarStore.getState().config.suit).toBe('suit_default');
    expect(useAvatarStore.getState().config.backpack).toBe('backpack_default');
  });

  it('should update a color', () => {
    const { setColor } = useAvatarStore.getState();
    setColor('primary', '#ef4444');
    expect(useAvatarStore.getState().config.colors.primary).toBe('#ef4444');
  });

  it('should not affect other colors when updating one', () => {
    const { setColor } = useAvatarStore.getState();
    setColor('primary', '#000000');
    expect(useAvatarStore.getState().config.colors.secondary).toBe('#3b82f6');
    expect(useAvatarStore.getState().config.colors.visor).toBe('#fbbf24');
  });
});
