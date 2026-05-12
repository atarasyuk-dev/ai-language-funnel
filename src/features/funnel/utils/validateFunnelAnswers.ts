// src/features/funnel/utils/validateFunnelAnswers.ts
import { z } from 'zod';
import { funnelConfig } from '../config/funnel.config';
import type { FunnelAnswers } from '../types/funnel.types';

type ValidationResult = { valid: boolean; error: string | null };

const emailSchema = z.string().email();

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function validateSlider(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function validateStep(step: number, answers: FunnelAnswers): ValidationResult {
  const question = funnelConfig[step - 1];
  if (!question?.required) return { valid: true, error: null };

  const value = answers[question.id];

  if (question.type === 'slider') {
    const numValue = typeof value === 'number' ? value : NaN;
    const isValid = validateSlider(numValue, question.min ?? 1, question.max ?? 10);
    return isValid
      ? { valid: true, error: null }
      : { valid: false, error: 'Please set your confidence level.' };
  }

  if (question.type === 'email') {
    const isValid = typeof value === 'string' && validateEmail(value);
    return isValid
      ? { valid: true, error: null }
      : { valid: false, error: 'Please enter a valid email address.' };
  }

  if (!value || value === '') {
    return { valid: false, error: 'Please answer this question to continue.' };
  }

  return { valid: true, error: null };
}
