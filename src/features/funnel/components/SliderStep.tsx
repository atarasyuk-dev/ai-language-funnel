// src/features/funnel/components/SliderStep.tsx
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/shared/components/Button';
import { useFunnelStore } from '../store/funnel.store';
import type { FunnelQuestion, FunnelAnswers } from '../types/funnel.types';

type SliderStepProps = {
  question: FunnelQuestion;
  answers: FunnelAnswers;
  onNext: () => void;
};

export function SliderStep({ question, answers, onNext }: SliderStepProps) {
  const { setAnswer } = useFunnelStore();
  const min = question.min ?? 1;
  const max = question.max ?? 10;
  const value = (answers[question.id] as number | undefined) ?? Math.round((min + max) / 2);

  useEffect(() => {
    if (answers[question.id] === undefined) {
      setAnswer(question.id, Math.round((min + max) / 2));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);
  const percent = ((value - min) / (max - min)) * 100;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAnswer(question.id, Number(e.target.value));
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <motion.span
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="text-7xl font-bold text-violet-600 leading-none"
        >
          {value}
        </motion.span>
        <span className="text-sm text-slate-400">out of {max}</span>
      </div>

      <div className="flex flex-col gap-3 px-1">
        <div className="relative">
          {/* Filled track */}
          <div className="absolute top-1/2 left-0 h-2 rounded-full bg-violet-500 -translate-y-1/2 pointer-events-none transition-all duration-100"
            style={{ width: `${percent}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            className="relative w-full h-2 appearance-none bg-violet-100 rounded-full cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6
              [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-violet-600
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-6
              [&::-moz-range-thumb]:h-6
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-violet-600
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>

        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>{question.minLabel}</span>
          <span>{question.maxLabel}</span>
        </div>
      </div>

      <Button onClick={onNext} fullWidth>
        Continue
      </Button>
    </div>
  );
}
