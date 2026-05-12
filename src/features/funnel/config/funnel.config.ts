import type { FunnelQuestion, FunnelAnswers } from '../types/funnel.types';

export const TOTAL_STEPS = 10;

const goalLabels: Record<string, string> = {
  career: 'career growth',
  travel: 'travel',
  confidence: 'daily confidence',
  exam: 'exam success',
};

const levelLabels: Record<string, string> = {
  beginner: 'beginner',
  elementary: 'elementary',
  intermediate: 'intermediate',
  advanced: 'advanced',
};

export const funnelConfig: FunnelQuestion[] = [
  {
    id: 'goal',
    step: 1,
    type: 'single-select',
    title: 'What is your main English goal?',
    subtitle: "We'll build your AI tutor plan around this.",
    required: true,
    options: [
      { id: 'career', label: 'Advance my career', emoji: '💼', description: 'Interviews, emails, presentations' },
      { id: 'travel', label: 'Travel with confidence', emoji: '✈️', description: 'Navigate any country with ease' },
      { id: 'confidence', label: 'Speak without hesitation', emoji: '🗣️', description: 'Stop freezing mid-sentence' },
      { id: 'exam', label: 'Pass an English exam', emoji: '🎓', description: 'IELTS, TOEFL, Cambridge' },
    ],
  },
  {
    id: 'level',
    step: 2,
    type: 'single-select',
    title: 'What is your current English level?',
    subtitle: 'Be honest — this helps us set the right starting point.',
    required: true,
    options: [
      { id: 'beginner', label: 'Beginner', emoji: '🌱', description: 'I know basic words and phrases' },
      { id: 'elementary', label: 'Elementary', emoji: '📖', description: 'I can handle simple conversations' },
      { id: 'intermediate', label: 'Intermediate', emoji: '🚀', description: 'I get by but make mistakes' },
      { id: 'advanced', label: 'Advanced', emoji: '⭐', description: 'I want to sound truly fluent' },
    ],
  },
  {
    id: 'motivation',
    step: 3,
    type: 'single-select',
    title: (answers: FunnelAnswers) =>
      `What is pushing you to improve for ${goalLabels[answers.goal ?? ''] ?? 'your goal'} right now?`,
    subtitle: 'Understanding your why helps us keep you motivated.',
    required: true,
    options: [
      { id: 'opportunity', label: 'A specific opportunity is coming', emoji: '⏰', description: 'Interview, trip, or deadline ahead' },
      { id: 'embarrassed', label: "I'm tired of feeling embarrassed", emoji: '😤', description: 'Enough holding back' },
      { id: 'stuck', label: "I've been stuck at the same level for too long", emoji: '🔄', description: 'Time to actually progress' },
      { id: 'inspired', label: 'Something finally inspired me', emoji: '✨', description: 'I feel ready to commit' },
    ],
  },
  {
    id: 'painPoint',
    step: 4,
    type: 'single-select',
    title: (answers: FunnelAnswers) =>
      `What holds ${levelLabels[answers.level ?? ''] ? `a ${levelLabels[answers.level!]} speaker` : 'you'} back the most?`,
    subtitle: 'Pick the one that feels most true.',
    required: true,
    options: [
      { id: 'speaking', label: 'Speaking — my mind goes blank', emoji: '😶', description: 'I know it but can\'t say it' },
      { id: 'grammar', label: 'Grammar — I always second-guess myself', emoji: '✏️', description: 'Rules feel overwhelming' },
      { id: 'vocabulary', label: 'Vocabulary — I run out of words', emoji: '📚', description: 'I can\'t express what I mean' },
      { id: 'listening', label: 'Listening — native speakers are too fast', emoji: '👂', description: 'I miss half of what\'s said' },
    ],
  },
  {
    id: 'timeline',
    step: 5,
    type: 'single-select',
    title: 'How soon do you want to see real progress?',
    subtitle: (answers: FunnelAnswers) =>
      `We'll calibrate your ${goalLabels[answers.goal ?? ''] ?? 'plan'} intensity around this.`,
    required: true,
    options: [
      { id: '1month', label: 'Within 1 month', emoji: '🔥', description: 'I need results fast' },
      { id: '3months', label: 'Within 3 months', emoji: '📅', description: 'Steady, consistent progress' },
      { id: '6months', label: 'Within 6 months', emoji: '🌿', description: "I'm playing the long game" },
      { id: 'flexible', label: 'No rush — whenever', emoji: '😌', description: 'I just want to keep improving' },
    ],
  },
  {
    id: 'learningStyle',
    step: 6,
    type: 'single-select',
    title: 'How do you learn best?',
    subtitle: 'Your AI tutor will adapt its teaching style to match.',
    required: true,
    options: [
      { id: 'conversation', label: 'Real conversations', emoji: '💬', description: 'Learn by actually speaking' },
      { id: 'structured', label: 'Structured lessons', emoji: '📋', description: 'Step-by-step explanations' },
      { id: 'immersion', label: 'Immersion & context', emoji: '🌍', description: 'Stories, videos, real content' },
      { id: 'games', label: 'Games & challenges', emoji: '🎮', description: 'Fun keeps me coming back' },
    ],
  },
  {
    id: 'dailyCommitment',
    step: 7,
    type: 'single-select',
    title: 'How much time can you practice each day?',
    subtitle: 'Even 5 minutes a day compounds fast.',
    required: true,
    options: [
      { id: '5min', label: '5 minutes', emoji: '⚡', description: 'Quick daily habit' },
      { id: '10min', label: '10 minutes', emoji: '🎯', description: 'Focused micro-sessions' },
      { id: '20min', label: '20 minutes', emoji: '💪', description: 'Solid daily practice' },
      { id: '30min', label: '30+ minutes', emoji: '🏆', description: 'Full immersion mode' },
    ],
  },
  {
    id: 'confidence',
    step: 8,
    type: 'slider',
    title: 'How confident do you feel speaking English right now?',
    subtitle: 'Drag the slider — be honest with yourself.',
    required: true,
    min: 1,
    max: 10,
    minLabel: 'Not at all',
    maxLabel: 'Very confident',
  },
  {
    id: 'planPreference',
    step: 9,
    type: 'result-preview',
    title: (answers: FunnelAnswers) =>
      `Your personalized plan is ready${answers.goal ? ` for ${goalLabels[answers.goal]}` : ''}.`,
    subtitle: 'Based on your answers, here is what your AI tutor will focus on.',
    required: true,
    options: [
      { id: 'yes', label: 'Get my full plan', emoji: '🚀' },
    ],
  },
  {
    id: 'email',
    step: 10,
    type: 'email',
    title: (answers: FunnelAnswers) =>
      `Your plan is ready${answers.goal ? ` — built for ${goalLabels[answers.goal]}` : ''}.`,
    subtitle: "Enter your email and we'll send your personalized AI tutor plan instantly.",
    required: true,
  },
];
