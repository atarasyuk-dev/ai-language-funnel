'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CareerOptionCard } from './CareerOptionCard';
import { CareerSliderStep } from './CareerSliderStep';
import { CareerConfidenceStep } from './CareerConfidenceStep';
import { CareerInsightStep } from './CareerInsightStep';
import { CareerEmailStep } from './CareerEmailStep';
import { CareerWelcome } from './CareerWelcome';
import { colors, subContextOptions } from '../config/career-funnel.config';
import { useCareerStore } from '../store/career-funnel.store';
import type { CareerQuestion, CareerAnswers } from '../types/career-funnel.types';

type CareerFunnelStepProps = {
  question: CareerQuestion;
  answers: CareerAnswers;
  direction: 'forward' | 'backward';
  onNext: () => void;
  onSubmit: (email: string) => void;
  isSubmitting: boolean;
  error: string | null;
};

const slideVariants = {
  enter: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? -40 : 40,
    opacity: 0,
  }),
};

function resolveText(
  value: string | ((answers: CareerAnswers) => string) | undefined,
  answers: CareerAnswers,
): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'function' ? value(answers) : value;
}

function QHeader({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      {kicker && (
        <div style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
          color: colors.coral, textTransform: 'uppercase' as const, marginBottom: '10px',
        }}>
          {kicker}
        </div>
      )}
      <h2 style={{
        fontSize: '26px', fontWeight: 700, color: colors.ink,
        lineHeight: 1.2, marginBottom: subtitle ? '10px' : 0,
        letterSpacing: '-0.02em', margin: 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: '15px', color: colors.inkSoft, lineHeight: 1.5, marginTop: '10px', marginBottom: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function StickyButton({
  onClick,
  disabled = false,
  label = 'Continue',
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      padding: '16px 20px 24px',
      background: `linear-gradient(180deg, transparent, ${colors.cream} 30%)`,
      pointerEvents: 'none',
    }}>
      <div style={{ maxWidth: '480px', margin: '0 auto', pointerEvents: 'auto' }}>
        <motion.button
          onClick={onClick}
          disabled={disabled}
          whileHover={{ translateY: disabled ? 0 : -1 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
          style={{
            width: '100%', padding: '16px',
            background: disabled ? colors.creamDeep : colors.coral,
            color: disabled ? colors.muted : '#fff',
            border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 600,
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: disabled ? 'none' : `0 8px 24px ${colors.coral}40`,
          }}
        >
          {label}
        </motion.button>
      </div>
    </div>
  );
}

function StepContent({
  question,
  answers,
  onNext,
  onSubmit,
  isSubmitting,
  error,
}: CareerFunnelStepProps) {
  const { setAnswer } = useCareerStore();
  const { type, id } = question;

  if (type === 'welcome') {
    return <CareerWelcome onStart={onNext} />;
  }

  if (type === 'insight') {
    return (
      <div style={{ padding: '24px 20px 100px', maxWidth: '480px', margin: '0 auto' }}>
        <CareerInsightStep answers={answers} />
        <StickyButton onClick={onNext} label="Keep going" />
      </div>
    );
  }

  if (type === 'email') {
    return (
      <div style={{ padding: '24px 20px 0', maxWidth: '480px', margin: '0 auto' }}>
        <CareerEmailStep
          answers={answers}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    );
  }

  const title = resolveText(question.title, answers) ?? '';
  const subtitle = resolveText(question.subtitle, answers);

  if (type === 'single-select') {
    const options = id === 'q2'
      ? (subContextOptions[answers.q1 ?? ''] ?? subContextOptions.meetings)
      : (question.options ?? []);
    const selected = answers[id as keyof CareerAnswers] as string | undefined;

    return (
      <div style={{ padding: '24px 20px 100px', maxWidth: '480px', margin: '0 auto' }}>
        {question.kicker || title ? (
          <QHeader kicker={question.kicker} title={title} subtitle={subtitle} />
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.map(opt => (
            <CareerOptionCard
              key={opt.id}
              option={opt}
              isSelected={selected === opt.id}
              onSelect={() => setAnswer(id as keyof CareerAnswers, opt.id)}
            />
          ))}
        </div>
        <StickyButton onClick={onNext} disabled={!selected} />
      </div>
    );
  }

  if (type === 'slider') {
    return (
      <div style={{ padding: '24px 20px 100px', maxWidth: '480px', margin: '0 auto' }}>
        <QHeader kicker={question.kicker} title={title} subtitle={subtitle} />
        <CareerSliderStep question={question} answers={answers} onNext={onNext} />
        <div style={{ marginTop: '20px' }}>
          <StickyButton onClick={onNext} />
        </div>
      </div>
    );
  }

  if (type === 'confidence-grid') {
    return (
      <div style={{ padding: '24px 20px 100px', maxWidth: '480px', margin: '0 auto' }}>
        <QHeader kicker={question.kicker} title={title} subtitle={subtitle} />
        <CareerConfidenceStep question={question} answers={answers} onNext={onNext} />
        <div style={{ marginTop: '20px' }}>
          <StickyButton onClick={onNext} disabled={!answers.q8} />
        </div>
      </div>
    );
  }

  return null;
}

export function CareerFunnelStep(props: CareerFunnelStepProps) {
  const { question, direction } = props;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.step}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <StepContent {...props} />
      </motion.div>
    </AnimatePresence>
  );
}
