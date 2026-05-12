// src/features/funnel/components/ResultPreview.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Lock } from 'lucide-react';
import {
  getGoalLabel,
  getReadinessScore,
  getResultPreviewItems,
  getPlanSummary,
} from '../utils/getPersonalizedCopy';
import { Button } from '@/shared/components/Button';
import type { FunnelAnswers } from '../types/funnel.types';

type ResultPreviewProps = {
  answers: FunnelAnswers;
  onNext: () => void;
};

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
  const items = getResultPreviewItems(answers);
  const { estimatedTimeline } = getPlanSummary(answers);
  const goalLabel = getGoalLabel(answers.goal ?? '');

  return (
    <div className="flex flex-col gap-6">
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
          ready to reach {goalLabel} in {estimatedTimeline}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {items.map((item) => (
          <motion.div
            key={item}
            variants={itemVariants}
            className="flex items-center gap-3 bg-white border-2 border-violet-100 rounded-2xl px-4 py-3"
          >
            <CheckCircle2 className="w-5 h-5 text-violet-500 flex-shrink-0" />
            <span className="text-slate-700 font-medium text-sm">{item}</span>
          </motion.div>
        ))}

        {/* Teaser — full plan visible after sign-up */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-4 py-3 opacity-60"
        >
          <Lock className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-400 text-sm">Full breakdown unlocked after sign-up</span>
        </motion.div>
      </motion.div>

      <Button onClick={onNext} fullWidth>
        Get my full plan →
      </Button>
    </div>
  );
}
