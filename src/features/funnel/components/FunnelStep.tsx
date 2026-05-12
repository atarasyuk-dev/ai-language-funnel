// src/features/funnel/components/FunnelStep.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { OptionCard } from './OptionCard';
import { SliderStep } from './SliderStep';
import { ResultPreview } from './ResultPreview';
import { EmailStep } from './EmailStep';
import { useFunnelStore } from '../store/funnel.store';
import type { FunnelQuestion, FunnelAnswers, FunnelDirection } from '../types/funnel.types';

type FunnelStepProps = {
  question: FunnelQuestion;
  answers: FunnelAnswers;
  direction: FunnelDirection;
  onNext: () => void;
  onSubmit?: (email: string) => void;
  isSubmitting: boolean;
  error: string | null;
};

const variants = {
  enter: (direction: FunnelDirection) => ({
    x: direction === 'forward' ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: FunnelDirection) => ({
    x: direction === 'forward' ? -300 : 300,
    opacity: 0,
  }),
};

function resolveText(
  value: string | ((a: FunnelAnswers) => string) | undefined,
  answers: FunnelAnswers,
): string | undefined {
  if (!value) return undefined;
  return typeof value === 'function' ? value(answers) : value;
}

type StepContentProps = {
  question: FunnelQuestion;
  answers: FunnelAnswers;
  onNext: () => void;
  onSubmit?: (email: string) => void;
  isSubmitting: boolean;
  error: string | null;
};

function StepContent({ question, answers, onNext, onSubmit, isSubmitting, error }: StepContentProps) {
  const { setAnswer } = useFunnelStore();

  if (question.type === 'single-select' || question.type === 'multi-select') {
    const currentValue = answers[question.id];

    function handleSelect(optionId: string) {
      setAnswer(question.id, optionId);
      if (question.type === 'single-select') {
        setTimeout(onNext, 200);
      }
    }

    return (
      <div className="flex flex-col gap-3">
        {question.options?.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={currentValue === option.id}
            onSelect={() => handleSelect(option.id)}
            multiSelect={question.type === 'multi-select'}
          />
        ))}
        {error && <p className="text-sm text-red-500 text-center mt-1">{error}</p>}
      </div>
    );
  }

  if (question.type === 'slider') {
    return <SliderStep question={question} answers={answers} onNext={onNext} />;
  }

  if (question.type === 'result-preview') {
    return <ResultPreview answers={answers} onNext={onNext} />;
  }

  if (question.type === 'email') {
    return (
      <EmailStep
        answers={answers}
        onSubmit={onSubmit!}
        isSubmitting={isSubmitting}
        error={error}
      />
    );
  }

  return null;
}

export function FunnelStep({ question, answers, direction, onNext, onSubmit, isSubmitting, error }: FunnelStepProps) {
  const title = resolveText(question.title, answers);
  const subtitle = resolveText(question.subtitle, answers);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.step}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col flex-1"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 leading-tight mb-2">{title}</h2>
          {subtitle && <p className="text-slate-500 text-base leading-relaxed">{subtitle}</p>}
        </div>

        <StepContent
          question={question}
          answers={answers}
          onNext={onNext}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      </motion.div>
    </AnimatePresence>
  );
}
