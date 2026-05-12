// src/features/funnel/components/ResultPreview.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Lock } from 'lucide-react';
import type { FunnelAnswers } from '../types/funnel.types';

type ResultPreviewProps = {
  answers: FunnelAnswers;
  onNext: () => void;
};

const goalLabels: Record<string, string> = {
  career: 'Career Growth',
  travel: 'Travel',
  confidence: 'Speaking Confidence',
  exam: 'Exam Success',
};

const commitmentLabels: Record<string, string> = {
  '5min': '5 min/day',
  '10min': '10 min/day',
  '20min': '20 min/day',
  '30min': '30+ min/day',
};

const styleLabels: Record<string, string> = {
  conversation: 'Conversational practice',
  structured: 'Structured lessons',
  immersion: 'Immersion & stories',
  games: 'Gamified challenges',
};

const timelineLabels: Record<string, string> = {
  '1month': '4 weeks',
  '3months': '3 months',
  '6months': '6 months',
  flexible: 'at your own pace',
};

function getReadinessScore(answers: FunnelAnswers): number {
  const confidence = answers.confidence ?? 5;
  const commitmentBonus: Record<string, number> = {
    '5min': 5, '10min': 10, '20min': 15, '30min': 20,
  };
  const bonus = commitmentBonus[answers.dailyCommitment ?? ''] ?? 10;
  return Math.min(99, Math.round((confidence / 10) * 75 + bonus));
}

const visibleItems = [
  (a: FunnelAnswers) =>
    `Focus: ${goalLabels[a.goal ?? ''] ?? 'Personalized path'}`,
  (a: FunnelAnswers) =>
    `Method: ${styleLabels[a.learningStyle ?? ''] ?? 'Adaptive AI sessions'}`,
  (a: FunnelAnswers) =>
    `Daily: ${commitmentLabels[a.dailyCommitment ?? ''] ?? 'Flexible schedule'}`,
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function ResultPreview({ answers, onNext }: ResultPreviewProps) {
  const score = getReadinessScore(answers);
  const timeline = timelineLabels[answers.timeline ?? ''] ?? 'your timeline';

  return (
    <div className="flex flex-col gap-6">
      {/* Score card */}
      <div className="bg-violet-600 rounded-3xl p-6 text-white text-center">
        <p className="text-sm font-medium text-violet-200 mb-1">Your readiness score</p>
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
          className="text-6xl font-bold leading-none mb-1"
        >
          {score}%
        </motion.p>
        <p className="text-sm text-violet-200">
          ready to reach {goalLabels[answers.goal ?? ''] ?? 'your goal'} in {timeline}
        </p>
      </div>

      {/* Plan items */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {visibleItems.map((getLabel, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex items-center gap-3 bg-white border-2 border-violet-100 rounded-2xl px-4 py-3"
          >
            <CheckCircle2 className="w-5 h-5 text-violet-500 flex-shrink-0" />
            <span className="text-slate-700 font-medium text-sm">{getLabel(answers)}</span>
          </motion.div>
        ))}

        {/* Locked item — teaser */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-4 py-3 opacity-60"
        >
          <Lock className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-400 text-sm">Full breakdown unlocked after sign-up</span>
        </motion.div>
      </motion.div>

      <button
        onClick={onNext}
        className="w-full bg-violet-600 text-white font-semibold py-4 rounded-2xl hover:bg-violet-700 active:bg-violet-800 transition-colors"
      >
        Get my full plan →
      </button>
    </div>
  );
}
