import { z } from 'zod';
import type { CareerQuestion, CareerAnswers } from '../types/career-funnel.types';

export function validateCareerStep(
  question: CareerQuestion,
  answers: CareerAnswers,
): { valid: boolean; error: string | null } {
  if (!question.required) return { valid: true, error: null };

  const { type, id, min = 1, max = 10 } = question;
  const value = answers[id as keyof CareerAnswers];

  if (type === 'insight' || type === 'welcome') {
    return { valid: true, error: null };
  }

  if (type === 'slider') {
    const num = value as number | undefined;
    if (num === undefined || !isFinite(num) || num < min || num > max) {
      return { valid: false, error: 'Please select a value to continue.' };
    }
    return { valid: true, error: null };
  }

  if (type === 'confidence-grid') {
    const num = value as number | undefined;
    if (num === undefined || num < 1 || num > 5) {
      return { valid: false, error: 'Please pick a number to continue.' };
    }
    return { valid: true, error: null };
  }

  if (type === 'email') {
    const result = z.string().email().safeParse(value);
    if (!result.success) {
      return { valid: false, error: 'Please enter a valid email address.' };
    }
    return { valid: true, error: null };
  }

  // single-select
  if (value === undefined || value === '') {
    return { valid: false, error: 'Please make a selection to continue.' };
  }
  return { valid: true, error: null };
}
