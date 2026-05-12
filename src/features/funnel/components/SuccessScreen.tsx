// src/features/funnel/components/SuccessScreen.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, RotateCcw } from 'lucide-react';
import { useFunnelStore } from '../store/funnel.store';
import type { FunnelAnswers } from '../types/funnel.types';

type SuccessScreenProps = {
  answers: FunnelAnswers;
};

const goalLabels: Record<string, string> = {
  career: 'career growth',
  travel: 'travel',
  confidence: 'speaking confidence',
  exam: 'exam success',
};

const nextSteps = [
  'Check your inbox — your plan arrives within 2 minutes',
  'Open lesson 1 — no app download required',
  'Practice for just 5 minutes today to start your streak',
];


export function SuccessScreen({ answers }: SuccessScreenProps) {
  const { reset } = useFunnelStore();
  const [copied, setCopied] = useState(false);
  const goalLabel = goalLabels[answers.goal ?? ''] ?? 'your goal';

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-6 py-8 text-center">
      {/* Animated checkmark — circle scales in, tick draws along path */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.05 }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <motion.circle
            cx="40" cy="40" r="36"
            stroke="#7c3aed"
            strokeWidth="4"
            fill="#ede9fe"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          />
          <motion.path
            d="M24 40 L35 51 L56 29"
            stroke="#7c3aed"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.45 }}
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">You&apos;re all set!</h2>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
          Your AI tutor plan for <span className="font-semibold text-violet-600">{goalLabel}</span> is on its way to{' '}
          <span className="font-semibold text-slate-700">{answers.email}</span>.
        </p>
      </motion.div>

      {/* Next steps */}
      <div className="w-full flex flex-col gap-2 text-left">
        {nextSteps.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.4, type: 'spring', stiffness: 300, damping: 24 }}
            className="flex items-start gap-3 bg-violet-50 dark:bg-violet-900/30 rounded-2xl px-4 py-3"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{step}</span>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-3 mt-2">
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 border-2 border-violet-200 dark:border-violet-700 text-violet-600 dark:text-violet-400 font-semibold py-3.5 rounded-2xl hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          {copied ? 'Link copied!' : 'Share with a friend'}
        </button>

        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mx-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Start over
        </button>
      </div>
    </div>
  );
}
