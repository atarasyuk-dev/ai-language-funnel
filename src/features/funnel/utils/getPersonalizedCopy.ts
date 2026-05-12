// src/features/funnel/utils/getPersonalizedCopy.ts
import type { FunnelAnswers } from '../types/funnel.types';

export type PlanSummary = {
  dailyGoal: string;
  focusArea: string;
  method: string;
  estimatedTimeline: string;
};

const goalLabels: Record<string, string> = {
  career: 'Career Growth',
  travel: 'Travel',
  confidence: 'Speaking Confidence',
  exam: 'Exam Success',
};

const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  elementary: 'Elementary',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const motivationLabels: Record<string, string> = {
  opportunity: 'an upcoming opportunity',
  embarrassed: 'a desire to stop holding back',
  stuck: 'breaking through a plateau',
  inspired: 'a moment of inspiration',
};

const styleLabels: Record<string, string> = {
  conversation: 'Conversational practice',
  structured: 'Structured lessons',
  immersion: 'Immersion & stories',
  games: 'Gamified challenges',
};

const commitmentLabels: Record<string, string> = {
  '5min': '5 min/day',
  '10min': '10 min/day',
  '20min': '20 min/day',
  '30min': '30+ min/day',
};

const timelineLabels: Record<string, string> = {
  '1month': '4 weeks',
  '3months': '3 months',
  '6months': '6 months',
  flexible: 'your own pace',
};

const focusByPainPoint: Record<string, string> = {
  speaking: 'spoken fluency & real-time recall',
  grammar: 'grammar intuition through pattern exposure',
  vocabulary: 'contextual vocabulary building',
  listening: 'listening comprehension & natural speech',
};

export function getGoalLabel(goal: string): string {
  return goalLabels[goal] ?? 'your goal';
}

export function getLevelLabel(level: string): string {
  return levelLabels[level] ?? 'your level';
}

export function getMotivationContext(motivation: string): string {
  return motivationLabels[motivation] ?? 'personal growth';
}

export function getPlanSummary(answers: FunnelAnswers): PlanSummary {
  return {
    dailyGoal: commitmentLabels[answers.dailyCommitment ?? ''] ?? 'Flexible schedule',
    focusArea: focusByPainPoint[answers.painPoint ?? ''] ?? 'overall English fluency',
    method: styleLabels[answers.learningStyle ?? ''] ?? 'Adaptive AI sessions',
    estimatedTimeline: timelineLabels[answers.timeline ?? ''] ?? 'your own pace',
  };
}

export function getResultPreviewItems(answers: FunnelAnswers): string[] {
  const plan = getPlanSummary(answers);
  return [
    `Goal: ${goalLabels[answers.goal ?? ''] ?? 'Personalized path'}`,
    `Focus: ${plan.focusArea}`,
    `Method: ${plan.method}`,
    `Daily: ${plan.dailyGoal} — results in ${plan.estimatedTimeline}`,
  ];
}

export function getReadinessScore(answers: FunnelAnswers): number {
  const confidence = answers.confidence ?? 5;
  const commitmentBonus: Record<string, number> = {
    '5min': 5, '10min': 10, '20min': 15, '30min': 20,
  };
  const bonus = commitmentBonus[answers.dailyCommitment ?? ''] ?? 10;
  return Math.min(99, Math.round((confidence / 10) * 75 + bonus));
}
