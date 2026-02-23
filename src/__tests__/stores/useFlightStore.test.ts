import { describe, it, expect, beforeEach } from 'vitest';
import { useFlightStore } from '@/stores/useFlightStore';

describe('useFlightStore', () => {
  beforeEach(() => {
    useFlightStore.setState({ phase: 'idle', targetPath: null });
  });

  it('should start with idle phase', () => {
    expect(useFlightStore.getState().phase).toBe('idle');
  });

  it('should update phase', () => {
    const { setPhase } = useFlightStore.getState();
    setPhase('launching');
    expect(useFlightStore.getState().phase).toBe('launching');
  });

  it('should transition through phases', () => {
    const { setPhase } = useFlightStore.getState();
    setPhase('launching');
    expect(useFlightStore.getState().phase).toBe('launching');
    setPhase('warping');
    expect(useFlightStore.getState().phase).toBe('warping');
    setPhase('orbit');
    expect(useFlightStore.getState().phase).toBe('orbit');
  });

  it('should have null targetPath by default', () => {
    expect(useFlightStore.getState().targetPath).toBeNull();
  });
});
