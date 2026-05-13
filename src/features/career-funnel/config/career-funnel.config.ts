import { Briefcase, Mic, FileText, Users, BookX, Volume2, Brain } from 'lucide-react';
import type { CareerQuestion, CareerAnswers } from '../types/career-funnel.types';

// ============================================================
// DESIGN TOKENS — sky palette (light & bright)
// ============================================================
export const colors = {
  cream: '#FFFFFF',
  creamDeep: '#EEF6FC',
  ink: '#0E2236',
  inkSoft: '#2B3F55',
  coral: '#0A93D1',
  coralSoft: '#D4ECFB',
  sage: '#7FA89C',
  sageSoft: '#E8F1ED',
  border: '#E2EBF2',
  muted: '#7A8898',
} as const;

// ============================================================
// COPY LOOKUP TABLES
// ============================================================
export const goalLabels: Record<string, string> = {
  meetings: 'speaking up in meetings',
  interviews: 'nailing job interviews',
  emails: 'writing professional emails',
  presentations: 'delivering presentations',
};

export const goalShort: Record<string, string> = {
  meetings: 'meetings',
  interviews: 'interviews',
  emails: 'emails',
  presentations: 'presentations',
};

export const subContextOptions: Record<string, Array<{ id: string; label: string; sub: string }>> = {
  meetings: [
    { id: 'standups', label: 'Daily standups', sub: 'Quick updates, status checks' },
    { id: 'clientcalls', label: 'Client calls', sub: 'External, high-stakes conversations' },
    { id: 'brainstorms', label: 'Brainstorms & debates', sub: 'Where ideas move fast' },
    { id: 'leadership', label: 'Talking to leadership', sub: '1:1s with senior people' },
  ],
  interviews: [
    { id: 'tech', label: 'Technical interviews', sub: 'Explaining how things work' },
    { id: 'behavioral', label: 'Behavioral rounds', sub: '"Tell me about a time…"' },
    { id: 'screening', label: 'Recruiter screens', sub: 'First 30-min conversations' },
    { id: 'panel', label: 'Panel / final rounds', sub: 'Multiple people, pressure' },
  ],
  emails: [
    { id: 'clients', label: 'Client communication', sub: 'Where tone really matters' },
    { id: 'internal', label: 'Internal updates', sub: 'Team & cross-functional' },
    { id: 'sensitive', label: 'Difficult conversations', sub: 'Pushback, declining, escalations' },
    { id: 'cold', label: 'Cold outreach', sub: 'Sales, networking, intros' },
  ],
  presentations: [
    { id: 'execs', label: 'Executive reviews', sub: 'Sharp questions from leaders' },
    { id: 'demos', label: 'Product demos', sub: 'Showing work to stakeholders' },
    { id: 'conferences', label: 'Conferences & panels', sub: 'Large audiences' },
    { id: 'team', label: 'Team presentations', sub: 'Internal knowledge sharing' },
  ],
};

export const blockerInsightCopy: Record<string, {
  headline: string;
  body: (answers: CareerAnswers) => string;
  stat: string;
  statLabel: string;
}> = {
  freeze: {
    headline: "You don't have a vocabulary problem.",
    body: () => "You have a retrieval problem. The words are there — they just don't come fast enough under pressure.",
    stat: '73%',
    statLabel: 'of professionals say the same thing',
  },
  translate: {
    headline: 'Your brain is doing double work.',
    body: () => "Translating from your native language is slow by design. The fix isn't more vocab — it's rewiring how you think in English.",
    stat: '2.3x',
    statLabel: 'faster after 6 weeks of targeted practice',
  },
  pronunciation: {
    headline: 'Your accent is probably fine.',
    body: () => "What's actually happening: you avoid words you're unsure about, which makes your English feel \"smaller\" than it is.",
    stat: '89%',
    statLabel: 'of pronunciation anxiety is internal',
  },
  vocabulary: {
    headline: "Generic English isn't your problem.",
    body: (answers) => `You need the specific 800-1200 words that show up in ${goalShort[answers.q1 ?? ''] || 'your work'} — not a 10,000-word dictionary.`,
    stat: '~1,000',
    statLabel: 'words covers 95% of your real situations',
  },
};

// ============================================================
// QUESTION CONFIG
// ============================================================
export const TOTAL_STEPS = 10;

export const careerFunnelConfig: CareerQuestion[] = [
  // Step 0 — Welcome
  {
    id: '__welcome',
    step: 0,
    type: 'welcome',
    title: 'Stop freezing in English at work.',
    subtitle: "In 90 seconds, our AI diagnoses what's actually holding you back — and builds a plan that fits 15 minutes a day.",
    required: false,
  },

  // Step 1 — Goal
  {
    id: 'q1',
    step: 1,
    type: 'single-select',
    kicker: 'The diagnosis starts here',
    title: "What's the #1 moment English fails you?",
    subtitle: 'Pick the one that costs you most — at work.',
    required: true,
    options: [
      { id: 'meetings', icon: Users, iconColor: '#2B3F55', label: 'Speaking up in meetings', sub: 'Standups, calls, brainstorms' },
      { id: 'interviews', icon: Briefcase, iconColor: '#0A93D1', label: 'Job interviews', sub: 'Technical and behavioral' },
      { id: 'emails', icon: FileText, iconColor: '#7FA89C', label: 'Professional writing', sub: 'Emails, Slack, docs' },
      { id: 'presentations', icon: Mic, iconColor: '#E8A93C', label: 'Presentations & demos', sub: 'Pitching to teams and clients' },
    ],
  },

  // Step 2 — Sub-context (branches on q1)
  {
    id: 'q2',
    step: 2,
    type: 'single-select',
    kicker: 'Going deeper',
    title: (answers) => `When you say "${goalLabels[answers.q1 ?? ''] ?? 'your goal'}" — what specifically?`,
    subtitle: 'The more specific, the more your plan will hit.',
    required: true,
    thinkingDelay: 900,
    options: [], // populated at render time from subContextOptions[answers.q1]
  },

  // Step 3 — Blocker
  {
    id: 'q3',
    step: 3,
    type: 'single-select',
    kicker: "What's really happening",
    title: 'In those moments, what breaks first?',
    subtitle: 'Be honest. This is the part the app fixes.',
    required: true,
    options: [
      { id: 'freeze', icon: BookX, iconColor: '#0A93D1', label: 'I freeze and forget words I know' },
      { id: 'translate', icon: Brain, iconColor: '#E8A93C', label: 'I translate in my head — too slow' },
      { id: 'pronunciation', icon: Volume2, iconColor: '#7FA89C', label: "I'm self-conscious about my accent" },
      { id: 'vocabulary', icon: FileText, iconColor: '#2B3F55', label: 'I lack the specific work vocabulary' },
    ],
  },

  // Step 4 — Frequency slider
  {
    id: 'q4',
    step: 4,
    type: 'slider',
    kicker: 'The cost of waiting',
    title: (answers) => `How often does ${goalShort[answers.q1 ?? ''] ?? 'your work'} put you in this spot?`,
    required: true,
    min: 1,
    max: 5,
    minLabel: 'Rarely',
    maxLabel: 'Every day',
    thinkingDelay: 900,
  },

  // Step 5 — AI Insight (display-only)
  {
    id: '__insight',
    step: 5,
    type: 'insight',
    kicker: 'AI Insight · Based on your answers',
    title: '',
    required: false,
  },

  // Step 6 — Daily time slider
  {
    id: 'q6',
    step: 6,
    type: 'slider',
    kicker: 'Building your plan',
    title: 'Realistically — how much time per day?',
    subtitle: "Pick the number you'll actually hit on busy days. Not your ideal day.",
    required: true,
    min: 5,
    max: 30,
    minLabel: '5 min',
    maxLabel: '30 min',
  },

  // Step 7 — Past attempts
  {
    id: 'q7',
    step: 7,
    type: 'single-select',
    kicker: "Learning from what didn't work",
    title: "When you've tried before — what killed it?",
    subtitle: "So we don't repeat the same mistake.",
    required: true,
    options: [
      { id: 'apps', label: 'Apps that felt like games', sub: 'Duolingo, Babbel — fun but no real progress' },
      { id: 'tutor', label: 'Generic tutors on iTalki', sub: 'Nice people, but not focused on my goals' },
      { id: 'youtube', label: 'YouTube & podcasts', sub: 'Passive — never got me speaking' },
      { id: 'never', label: "Haven't really tried before", sub: 'Just starting to take this seriously' },
    ],
  },

  // Step 8 — Confidence grid
  {
    id: 'q8',
    step: 8,
    type: 'confidence-grid',
    kicker: 'The honest baseline',
    title: (answers) => `Right now — how do you feel walking into ${goalShort[answers.q1 ?? ''] ?? 'a work conversation'}?`,
    subtitle: 'No judgment. We need the real number to measure progress.',
    required: true,
    min: 1,
    max: 5,
    thinkingDelay: 900,
  },

  // Step 9 — Deadline
  {
    id: 'q9',
    step: 9,
    type: 'single-select',
    kicker: 'Setting the finish line',
    title: 'By when do you want to feel different?',
    subtitle: 'A specific deadline doubles your follow-through. Pick what feels real.',
    required: true,
    options: [
      { id: '4w', label: '4 weeks', sub: 'I have something coming up' },
      { id: '8w', label: '8 weeks', sub: 'Steady, focused window' },
      { id: '12w', label: '12 weeks', sub: 'Build it solidly' },
      { id: 'open', label: 'No deadline', sub: 'Just want to make progress' },
    ],
  },

  // Step 10 — Email
  {
    id: 'q10',
    step: 10,
    type: 'email',
    kicker: 'Your plan is ready',
    title: "Here's what we built for you.",
    subtitle: 'Preview below. Unlock with your email to start.',
    required: true,
  },
];
