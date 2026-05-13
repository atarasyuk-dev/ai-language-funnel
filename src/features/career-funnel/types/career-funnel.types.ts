import type React from 'react';

export type CareerQuestionType =
  | 'welcome'
  | 'single-select'
  | 'slider'
  | 'confidence-grid'
  | 'insight'
  | 'email';

export type CareerOption = {
  id: string;
  label: string;
  sub?: string;
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  iconColor?: string;
};

export type CareerAnswers = {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: number;
  q6?: number;
  q7?: string;
  q8?: number;
  q9?: string;
  q10?: string;
};

export type CareerQuestion = {
  id: keyof CareerAnswers | '__welcome' | '__insight';
  step: number;
  type: CareerQuestionType;
  kicker?: string;
  title: string | ((answers: CareerAnswers) => string);
  subtitle?: string | ((answers: CareerAnswers) => string);
  options?: CareerOption[];
  required?: boolean;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  thinkingDelay?: number;
};

export type CareerState = {
  currentStep: number;
  answers: CareerAnswers;
  direction: 'forward' | 'backward';
  isThinking: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
};

export type CareerSubmitPayload = {
  answers: CareerAnswers;
  timestamp: string;
};
