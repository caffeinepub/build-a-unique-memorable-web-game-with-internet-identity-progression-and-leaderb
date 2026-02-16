import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProgressionState } from '../game/types';

interface ProgressionStore extends ProgressionState {
  unlockSpeedMultiplier: (multiplier: number) => void;
  updateBestScore: (score: number) => void;
  updateBestStreak: (streak: number) => void;
  completeTutorial: () => void;
  resetProgression: () => void;
}

export const useProgressionStore = create<ProgressionStore>()(
  persist(
    (set) => ({
      unlockedSpeedMultipliers: [1.0],
      bestLocalScore: 0,
      bestLocalStreak: 0,
      tutorialCompleted: false,

      unlockSpeedMultiplier: (multiplier) =>
        set((state) => ({
          unlockedSpeedMultipliers: state.unlockedSpeedMultipliers.includes(multiplier)
            ? state.unlockedSpeedMultipliers
            : [...state.unlockedSpeedMultipliers, multiplier].sort(),
        })),

      updateBestScore: (score) =>
        set((state) => ({
          bestLocalScore: Math.max(state.bestLocalScore, score),
        })),

      updateBestStreak: (streak) =>
        set((state) => ({
          bestLocalStreak: Math.max(state.bestLocalStreak, streak),
        })),

      completeTutorial: () => set({ tutorialCompleted: true }),

      resetProgression: () =>
        set({
          unlockedSpeedMultipliers: [1.0],
          bestLocalScore: 0,
          bestLocalStreak: 0,
          tutorialCompleted: false,
        }),
    }),
    {
      name: 'velocity-shift-progression',
    }
  )
);
