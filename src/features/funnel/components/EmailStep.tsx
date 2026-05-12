// src/features/funnel/components/EmailStep.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { FunnelAnswers } from '../types/funnel.types';

type EmailStepProps = {
  answers: FunnelAnswers;
  onSubmit: (email: string) => void;
  isSubmitting: boolean;
  error: string | null;
};

const goalLabels: Record<string, string> = {
  career: 'career growth',
  travel: 'travel',
  confidence: 'speaking confidence',
  exam: 'exam success',
};

const benefits = [
  'Your personalized AI tutor plan (PDF)',
  'Daily practice schedule tailored to your level',
  'First lesson unlocked instantly',
];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const benefitVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const benefitItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function EmailStep({ answers, onSubmit, isSubmitting, error }: EmailStepProps) {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [debouncedError, setDebouncedError] = useState<string | null>(null);

  const goalLabel = goalLabels[answers.goal ?? ''] ?? 'your goal';

  useEffect(() => {
    if (!touched || email.length === 0) {
      setDebouncedError(null);
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedError(isValidEmail(email) ? null : 'Please enter a valid email address.');
    }, 500);
    return () => clearTimeout(timer);
  }, [email, touched]);

  const fieldError = debouncedError;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail(email)) return;
    onSubmit(email);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Value proposition */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/30 dark:to-indigo-900/30 border border-violet-100 dark:border-violet-800 rounded-3xl p-5">
        <p className="text-sm font-semibold text-violet-500 uppercase tracking-wide mb-1">
          Your plan is ready
        </p>
        <p className="text-slate-700 dark:text-slate-200 font-medium leading-snug">
          Personalized for {goalLabel} — enter your email to receive it.
        </p>
      </div>

      {/* Benefits */}
      <motion.ul
        variants={benefitVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2"
      >
        {benefits.map((benefit) => (
          <motion.li key={benefit} variants={benefitItem} className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />
            <span className="text-sm text-slate-600 dark:text-slate-400">{benefit}</span>
          </motion.li>
        ))}
      </motion.ul>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="your@email.com"
            autoComplete="email"
            className={cn(
              'w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 text-slate-800 dark:text-white dark:bg-slate-800 placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none transition-colors',
              fieldError
                ? 'border-red-400 focus:border-red-500'
                : 'border-slate-200 dark:border-slate-700 focus:border-violet-500',
            )}
          />
        </div>

        {(fieldError ?? error) && (
          <p className="text-sm text-red-500 px-1">{fieldError ?? error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-violet-600 text-white font-semibold py-4 rounded-2xl hover:bg-violet-700 active:bg-violet-800 transition-colors disabled:bg-violet-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
            : 'Send me my plan'}
        </button>

        <p className="text-xs text-slate-400 text-center">
          No spam, ever. Unsubscribe with one click.
        </p>
      </form>
    </div>
  );
}
