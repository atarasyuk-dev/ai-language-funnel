// src/features/funnel/hooks/useFunnelNavigation.ts
'use client';

import { useFunnelStore } from '../store/funnel.store';
import { funnelConfig, TOTAL_STEPS } from '../config/funnel.config';
import { validateStep } from '../utils/validateFunnelAnswers';
import type { FunnelAnswers } from '../types/funnel.types';

export function useFunnelNavigation() {
  const {
    currentStep,
    answers,
    direction,
    nextStep,
    prevStep,
    setError,
  } = useFunnelStore();

  const currentQuestion = funnelConfig[currentStep - 1];
  const canGoBack = currentStep > 1;
  const isLastStep = currentStep === TOTAL_STEPS;
  const progress = ((currentStep - 1) / TOTAL_STEPS) * 100;

  function handleNext() {
    const { valid, error: stepError } = validateStep(currentStep, answers);
    if (!valid) {
      setError(stepError);
      return;
    }
    setError(null);
    nextStep();
  }

  function handleBack() {
    setError(null);
    prevStep();
  }

  return {
    currentStep,
    currentQuestion,
    totalSteps: TOTAL_STEPS,
    answers,
    direction,
    canGoBack,
    isLastStep,
    progress,
    handleNext,
    handleBack,
    isStepValid: (step: number) => validateStep(step, answers).valid,
  };
}
