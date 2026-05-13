'use client';

import { colors } from '../config/career-funnel.config';
import { useCareerStore } from '../store/career-funnel.store';
import { useCareerNavigation } from '../hooks/useCareerNavigation';
import { CareerFunnelStep } from './CareerFunnelStep';
import { CareerProgressBar } from './CareerProgressBar';
import { CareerSuccessScreen } from './CareerSuccessScreen';
import { getThinkingMessage } from '../utils/getCareerPersonalizedCopy';

function AIThinking({ message }: { message: string }) {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 18px', background: '#E8F1ED',
        borderRadius: '999px', fontSize: '13px', color: '#2B3F55',
        width: 'fit-content',
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '6px', height: '6px', borderRadius: '50%', background: '#7FA89C',
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
        <span>{message}</span>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function CareerFunnel() {
  const { setAnswer, setSubmitting, setSubmitted, setError, answers, isSubmitting, isSubmitted, error } = useCareerStore();
  const {
    currentStep,
    currentQuestion,
    totalSteps,
    direction,
    isThinking,
    canGoBack,
    handleNext,
    handleBack,
  } = useCareerNavigation();

  async function handleSubmit(email: string) {
    setAnswer('q10', email);
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/career-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          answers: { ...answers, q10: email },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError((body as { error?: string }).error ?? 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif', color: colors.ink }}>
        <CareerSuccessScreen answers={answers} />
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.cream,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
      color: colors.ink,
      position: 'relative',
    }}>
      <CareerProgressBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        canGoBack={canGoBack}
        onBack={handleBack}
      />

      {isThinking ? (
        <AIThinking message={getThinkingMessage(currentStep, answers)} />
      ) : (
        <CareerFunnelStep
          question={currentQuestion}
          answers={answers}
          direction={direction}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}
    </div>
  );
}
