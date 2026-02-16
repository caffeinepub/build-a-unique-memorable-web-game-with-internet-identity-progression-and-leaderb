import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  soundEnabled: boolean;
  reducedMotion: boolean;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      soundEnabled: true,
      reducedMotion: false,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
    }),
    {
      name: 'velocity-shift-settings',
    }
  )
);
