// src/features/funnel/components/ProgressBar.tsx
'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  onBack: () => void;
};

export function ProgressBar({ currentStep, totalSteps, canGoBack, onBack }: ProgressBarProps) {
  const progress = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="flex items-center gap-3 mb-8">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Go back"
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-colors disabled:opacity-0 disabled:pointer-events-none"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 flex flex-col gap-1">
        <div className="h-1.5 w-full bg-violet-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-violet-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      <span className="flex-shrink-0 text-xs font-medium text-violet-400 w-14 text-right">
        {currentStep} of {totalSteps}
      </span>
    </div>
  );
}
