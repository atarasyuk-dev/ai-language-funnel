'use client';

import { create } from 'zustand';
import type { CareerAnswers, CareerState } from '../types/career-funnel.types';
import { TOTAL_STEPS } from '../config/career-funnel.config';

type CareerStore = CareerState & {
  setAnswer: (field: keyof CareerAnswers, value: string | number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setThinking: (value: boolean) => void;
  setSubmitting: (value: boolean) => void;
  setSubmitted: (value: boolean) => void;
  setError: (message: string | null) => void;
};

const initialState: CareerState = {
  currentStep: 0,
  answers: {},
  direction: 'forward',
  isThinking: false,
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

export const useCareerStore = create<CareerStore>((set) => ({
  ...initialState,

  setAnswer: (field, value) =>
    set((state) => ({ answers: { ...state.answers, [field]: value } })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS),
      direction: 'forward',
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
      direction: 'backward',
    })),

  reset: () => set(initialState),

  setThinking: (value) => set({ isThinking: value }),

  setSubmitting: (value) => set({ isSubmitting: value }),

  setSubmitted: (value) => set({ isSubmitted: value }),

  setError: (message) => set({ error: message }),
}));
