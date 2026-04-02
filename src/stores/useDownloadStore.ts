import { create } from "zustand";

export type DownloadStatus = "idle" | "resolving" | "downloading" | "completed" | "error" | "limit-reached";

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  durationSeconds: number;
  url: string;
  filename: string;
}

export interface DownloadState {
  status: DownloadStatus;
  videoInfo: VideoInfo | null;
  progress: number; // 0-100
  speed: number; // bytes/s current speed
  downloaded: number; // bytes downloaded
  totalSize: number; // bytes total
  elapsedSeconds: number;
  error: string | null;
  dailyCount: number;
  dailyLimit: number;

  setStatus: (status: DownloadStatus) => void;
  setVideoInfo: (info: VideoInfo | null) => void;
  setProgress: (progress: number) => void;
  setSpeed: (speed: number) => void;
  setDownloaded: (bytes: number) => void;
  setTotalSize: (bytes: number) => void;
  setElapsedSeconds: (seconds: number) => void;
  setError: (error: string | null) => void;
  incrementDailyCount: () => void;
  initDailyCount: () => void;
  reset: () => void;
}

const DAILY_LIMIT = 30;
const STORAGE_KEY = "tf_web_downloads";

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadDailyCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    if (data.date !== getTodayKey()) return 0;
    return data.count || 0;
  } catch {
    return 0;
  }
}

function saveDailyCount(count: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), count }));
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  status: "idle",
  videoInfo: null,
  progress: 0,
  speed: 0,
  downloaded: 0,
  totalSize: 0,
  elapsedSeconds: 0,
  error: null,
  dailyCount: 0,
  dailyLimit: DAILY_LIMIT,

  setStatus: (status) => set({ status }),
  setVideoInfo: (info) => set({ videoInfo: info }),
  setProgress: (progress) => set({ progress }),
  setSpeed: (speed) => set({ speed }),
  setDownloaded: (bytes) => set({ downloaded: bytes }),
  setTotalSize: (bytes) => set({ totalSize: bytes }),
  setElapsedSeconds: (seconds) => set({ elapsedSeconds: seconds }),
  setError: (error) => set({ error, status: error ? "error" : get().status }),
  incrementDailyCount: () => {
    const newCount = get().dailyCount + 1;
    set({ dailyCount: newCount });
    saveDailyCount(newCount);
  },
  initDailyCount: () => {
    const count = loadDailyCount();
    set({ dailyCount: count });
  },
  reset: () => set({
    status: "idle",
    videoInfo: null,
    progress: 0,
    speed: 0,
    downloaded: 0,
    totalSize: 0,
    elapsedSeconds: 0,
    error: null,
  }),
}));
