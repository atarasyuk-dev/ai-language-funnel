// src/features/funnel/store/funnel.store.ts
'use client';

import { create } from 'zustand';
import type { FunnelAnswers, FunnelState } from '../types/funnel.types';
import { TOTAL_STEPS } from '../config/funnel.config';

type FunnelStore = FunnelState & {
  setAnswer: (field: keyof FunnelAnswers, value: string | number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setSubmitting: (value: boolean) => void;
  setSubmitted: (value: boolean) => void;
  setError: (message: string | null) => void;
};

const initialState: FunnelState = {
  currentStep: 1,
  answers: {},
  isSubmitting: false,
  isSubmitted: false,
  error: null,
  direction: 'forward',
};

export const useFunnelStore = create<FunnelStore>((set) => ({
  ...initialState,

  setAnswer: (field, value) =>
    set((state) => ({
      answers: { ...state.answers, [field]: value },
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS),
      direction: 'forward',
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
      direction: 'backward',
    })),

  reset: () => set(initialState),

  setSubmitting: (value) => set({ isSubmitting: value }),

  setSubmitted: (value) => set({ isSubmitted: value }),

  setError: (message) => set({ error: message }),
}));
