import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingStore {
  tutorialDismissed: boolean;
  dismissTutorial: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      tutorialDismissed: false,
      dismissTutorial: () => set({ tutorialDismissed: true }),
      resetOnboarding: () => set({ tutorialDismissed: false }),
    }),
    {
      name: 'velocity-shift-onboarding',
    }
  )
);
