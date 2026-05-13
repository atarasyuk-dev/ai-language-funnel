'use client';

import { useCareerStore } from '../store/career-funnel.store';
import { careerFunnelConfig, TOTAL_STEPS } from '../config/career-funnel.config';
import { validateCareerStep } from '../utils/validateCareerAnswers';
import type { CareerAnswers } from '../types/career-funnel.types';

export function useCareerNavigation() {
  const {
    currentStep,
    answers,
    direction,
    isThinking,
    nextStep,
    prevStep,
    setThinking,
    setError,
  } = useCareerStore();

  const currentQuestion = careerFunnelConfig[currentStep];
  const canGoBack = currentStep > 1;
  const isLastStep = currentStep === TOTAL_STEPS;
  const progress = currentStep === 0 ? 0 : Math.min(100, (currentStep / TOTAL_STEPS) * 100);

  function handleNext() {
    if (!currentQuestion) return;

    const { valid, error: stepError } = validateCareerStep(currentQuestion, answers);
    if (!valid) {
      setError(stepError);
      return;
    }
    setError(null);

    const { thinkingDelay } = currentQuestion;
    if (thinkingDelay) {
      setThinking(true);
      setTimeout(() => {
        setThinking(false);
        nextStep();
      }, thinkingDelay);
    } else {
      nextStep();
    }
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
    isThinking,
    canGoBack,
    isLastStep,
    progress,
    handleNext,
    handleBack,
  };
}
