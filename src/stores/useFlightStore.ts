import { create } from 'zustand';

type FlightState = 'idle' | 'launching' | 'warping' | 'orbit';

interface FlightStore {
  phase: FlightState;
  setPhase: (phase: FlightState) => void;
  targetPath: string | null;
  setTargetPath: (path: string | null) => void;
}

export const useFlightStore = create<FlightStore>((set) => ({
  phase: 'idle',
  setPhase: (phase) => set({ phase }),
  targetPath: null,
  setTargetPath: (targetPath) => set({ targetPath }),
}));
