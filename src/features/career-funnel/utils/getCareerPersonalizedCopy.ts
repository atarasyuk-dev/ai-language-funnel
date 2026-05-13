import type { CareerAnswers } from '../types/career-funnel.types';
import { goalLabels, goalShort, blockerInsightCopy } from '../config/career-funnel.config';

export function getGoalLabel(q1?: string): string {
  return goalLabels[q1 ?? ''] ?? 'your goal';
}

export function getGoalShort(q1?: string): string {
  return goalShort[q1 ?? ''] ?? 'your work';
}

export function getBlockerInsight(
  q3?: string,
  answers?: CareerAnswers,
): { headline: string; body: string; stat: string; statLabel: string } {
  const copy = blockerInsightCopy[q3 ?? ''] ?? blockerInsightCopy.freeze;
  return {
    headline: copy.headline,
    body: copy.body(answers ?? {}),
    stat: copy.stat,
    statLabel: copy.statLabel,
  };
}

export function getThinkingMessage(step: number, answers: CareerAnswers): string {
  if (step === 2) return `Mapping your ${getGoalShort(answers.q1)} pattern…`;
  if (step === 4) return 'Calculating your urgency score…';
  if (step === 8) return 'Calibrating your starting point…';
  return 'Analyzing your answer…';
}

export function getPlanPreviewData(answers: CareerAnswers): {
  timeStr: string;
  goalLabel: string;
  startLevel: number;
  targetLevel: number;
  weeks: number;
} {
  const startLevel = answers.q8 ?? 2;
  return {
    timeStr: answers.q6 ? `${answers.q6}-min` : '15-min',
    goalLabel: getGoalShort(answers.q1),
    startLevel,
    targetLevel: Math.min(5, startLevel + 2),
    weeks: answers.q9 === '4w' ? 4 : answers.q9 === '8w' ? 8 : 12,
  };
}

export function getFrequencyLabel(value: number): { text: string; cost: string } {
  const map: Record<number, { text: string; cost: string }> = {
    1: { text: 'Rarely', cost: '< 1 time per month' },
    2: { text: 'Sometimes', cost: '1-2 times per month' },
    3: { text: 'Often', cost: 'Almost every week' },
    4: { text: 'Constantly', cost: 'Multiple times per week' },
    5: { text: 'Every day', cost: "It's the default" },
  };
  return map[value] ?? map[3];
}

export function getMissedMomentsLabel(value: number): string {
  if (value === 5) return '20+';
  if (value === 4) return '8-12';
  return '4-6';
}

export function getConfidenceHint(value: number): string {
  if (value <= 2) return "🎯 You're exactly who LinguaAI was built for. We start with low-stakes scenarios.";
  if (value === 3) return '👍 You have a foundation — we just need to close the confidence gap.';
  return "💪 You're already solid. We'll push you into edge cases and high-pressure moments.";
}

export function getTimeHint(value: number): string {
  if (value <= 10) return "Short sessions — we'll focus on micro-practice between meetings.";
  if (value <= 20) return 'A real practice window. Perfect for our morning routine.';
  return 'Deep work mode. Your plan can include longer scenario simulations.';
}
