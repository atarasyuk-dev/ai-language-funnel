// src/features/funnel/hooks/useFunnelNavigation.ts
'use client';

import { useFunnelStore } from '../store/funnel.store';
import { funnelConfig, TOTAL_STEPS } from '../config/funnel.config';
import type { FunnelAnswers } from '../types/funnel.types';

function isStepValid(step: number, answers: FunnelAnswers): boolean {
  const question = funnelConfig[step - 1];
  if (!question?.required) return true;

  const value = answers[question.id];
  if (value === undefined || value === null || value === '') return false;
  if (question.type === 'slider' && typeof value === 'number') return true;
  return Boolean(value);
}

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
    if (!isStepValid(currentStep, answers)) {
      setError('Please answer this question to continue.');
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
    isStepValid: (step: number) => isStepValid(step, answers),
  };
}
