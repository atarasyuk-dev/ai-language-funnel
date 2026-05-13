'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCareerStore } from '../store/career-funnel.store';
import { colors } from '../config/career-funnel.config';
import { getConfidenceHint } from '../utils/getCareerPersonalizedCopy';
import type { CareerQuestion, CareerAnswers } from '../types/career-funnel.types';

type CareerConfidenceStepProps = {
  question: CareerQuestion;
  answers: CareerAnswers;
  onNext: () => void;
};

export function CareerConfidenceStep({ answers }: CareerConfidenceStepProps) {
  const { setAnswer } = useCareerStore();
  const value = answers.q8 ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <motion.button
            key={n}
            onClick={() => setAnswer('q8', n)}
            whileHover={{ scale: value === n ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 20 }}
            style={{
              flex: 1,
              aspectRatio: '1',
              border: `2px solid ${value === n ? colors.ink : colors.border}`,
              background: value === n ? colors.ink : colors.cream,
              color: value === n ? colors.cream : colors.ink,
              borderRadius: '12px',
              fontSize: '20px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {n}
          </motion.button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: colors.muted }}>
        <span>Dread it</span>
        <span>Crush it</span>
      </div>

      <AnimatePresence>
        {value > 0 && (
          <motion.div
            key={value <= 2 ? 'low' : value === 3 ? 'mid' : 'high'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              padding: '16px',
              background: value <= 2 ? colors.coralSoft : value <= 3 ? colors.creamDeep : colors.sageSoft,
              borderRadius: '12px',
              fontSize: '13px',
              color: colors.inkSoft,
              lineHeight: 1.5,
            }}
          >
            {getConfidenceHint(value)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
