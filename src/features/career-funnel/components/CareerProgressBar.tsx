'use client';

import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../config/career-funnel.config';

type CareerProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  onBack: () => void;
};

const phases = [
  { name: 'Goal', range: [1, 2] as [number, number] },
  { name: 'Diagnosis', range: [3, 5] as [number, number] },
  { name: 'Plan', range: [6, 9] as [number, number] },
  { name: 'Result', range: [10, 10] as [number, number] },
];

export function CareerProgressBar({ currentStep, totalSteps, canGoBack, onBack }: CareerProgressBarProps) {
  if (currentStep === 0) return null;

  const currentPhase = phases.findIndex(p => currentStep >= p.range[0] && currentStep <= p.range[1]);
  const percent = Math.min(100, (currentStep / totalSteps) * 100);

  return (
    <div>
      {/* Logo + back button row */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '14px 20px',
        maxWidth: '480px', margin: '0 auto', justifyContent: 'space-between',
      }}>
        <button
          onClick={onBack}
          disabled={!canGoBack}
          style={{
            background: 'transparent', border: 'none',
            cursor: canGoBack ? 'pointer' : 'default',
            padding: '8px', opacity: canGoBack ? 1 : 0.3,
            display: 'flex', alignItems: 'center', color: colors.inkSoft,
          }}
        >
          <ChevronLeft size={22} />
        </button>
        <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', color: colors.ink }}>
          LINGUA<span style={{ color: colors.coral }}>AI</span>
        </div>
        <div style={{ width: '38px' }} />
      </div>

      {/* Phases + progress bar */}
      <div style={{ padding: '0 20px 0', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {phases.map((p, i) => (
              <div key={p.name} style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                color: i <= currentPhase ? colors.ink : colors.muted,
                opacity: i <= currentPhase ? 1 : 0.5,
                textTransform: 'uppercase' as const,
                transition: 'all 0.3s',
              }}>
                {p.name}
                {i < phases.length - 1 && (
                  <span style={{ marginLeft: '6px', color: colors.border }}>·</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: colors.muted, fontWeight: 600 }}>
            {currentStep} / {totalSteps}
          </div>
        </div>

        <div style={{ height: '4px', background: colors.creamDeep, borderRadius: '999px', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: colors.coral, borderRadius: '999px' }}
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}
