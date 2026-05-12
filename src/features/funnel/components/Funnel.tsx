// src/features/funnel/components/Funnel.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useFunnelStore } from '../store/funnel.store';
import { useFunnelNavigation } from '../hooks/useFunnelNavigation';
import { ProgressBar } from './ProgressBar';
import { FunnelStep } from './FunnelStep';
import { SuccessScreen } from './SuccessScreen';

export function Funnel() {
  const { isSubmitting, isSubmitted, error, setSubmitting, setSubmitted, setError } =
    useFunnelStore();
  const { currentQuestion, answers, direction, canGoBack, handleNext, handleBack } =
    useFunnelNavigation();

  async function handleSubmit(email: string) {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: { ...answers, email },
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  if (isSubmitted) {
    return <SuccessScreen answers={answers} />;
  }

  if (!currentQuestion) return null;

  return (
    <motion.div
      className="flex flex-col flex-1"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <ProgressBar
        currentStep={currentQuestion.step}
        totalSteps={10}
        canGoBack={canGoBack}
        onBack={handleBack}
      />

      <FunnelStep
        question={currentQuestion}
        answers={answers}
        direction={direction}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />

      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
