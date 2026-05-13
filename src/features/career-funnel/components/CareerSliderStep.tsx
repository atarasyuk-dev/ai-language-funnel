'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';
import { useCareerStore } from '../store/career-funnel.store';
import { colors } from '../config/career-funnel.config';
import {
  getFrequencyLabel,
  getMissedMomentsLabel,
  getTimeHint,
} from '../utils/getCareerPersonalizedCopy';
import type { CareerQuestion, CareerAnswers } from '../types/career-funnel.types';

type CareerSliderStepProps = {
  question: CareerQuestion;
  answers: CareerAnswers;
  onNext: () => void;
};

export function CareerSliderStep({ question, answers, onNext }: CareerSliderStepProps) {
  const { setAnswer } = useCareerStore();
  const { id, min = 1, max = 10 } = question;
  const isFrequency = id === 'q4';
  const step = isFrequency ? 1 : 5;
  const defaultValue = isFrequency ? 3 : 15;
  const value = (answers[id as keyof CareerAnswers] as number | undefined) ?? defaultValue;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (answers[id as keyof CareerAnswers] === undefined) {
      setAnswer(id as keyof CareerAnswers, defaultValue);
    }
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAnswer(id as keyof CareerAnswers, parseInt(e.target.value));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {isFrequency ? (
        <FrequencyDisplay value={value} />
      ) : (
        <TimeDisplay value={value} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          style={{ width: '100%', accentColor: colors.coral }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: colors.muted }}>
          <span>{question.minLabel}</span>
          {!isFrequency && <span>15 min</span>}
          <span>{question.maxLabel}</span>
        </div>
      </div>

      {isFrequency && value >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '14px 16px',
            background: colors.cream,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}
        >
          <AlertCircle size={18} color={colors.coral} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ fontSize: '13px', color: colors.inkSoft, lineHeight: 1.5 }}>
            That&apos;s roughly <strong>{getMissedMomentsLabel(value)} missed moments per month.</strong> Most of our users join here.
          </div>
        </motion.div>
      )}

      {!isFrequency && (
        <div style={{
          padding: '14px 16px',
          background: colors.cream,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          fontSize: '13px',
          color: colors.inkSoft,
          lineHeight: 1.5,
        }}>
          <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} color={colors.coral} />
          {getTimeHint(value)}
        </div>
      )}
    </div>
  );
}

function FrequencyDisplay({ value }: { value: number }) {
  const { text, cost } = getFrequencyLabel(value);
  return (
    <div style={{
      background: colors.coralSoft,
      borderRadius: '16px',
      padding: '24px 20px',
      textAlign: 'center',
    }}>
      <motion.div
        key={text}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 20 }}
        style={{ fontSize: '32px', fontWeight: 700, color: colors.ink, marginBottom: '4px', letterSpacing: '-0.02em' }}
      >
        {text}
      </motion.div>
      <div style={{ fontSize: '14px', color: colors.inkSoft }}>{cost}</div>
    </div>
  );
}

function TimeDisplay({ value }: { value: number }) {
  return (
    <div style={{
      background: colors.creamDeep,
      borderRadius: '18px',
      padding: '28px 20px',
      textAlign: 'center',
    }}>
      <motion.div
        key={value}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 20 }}
        style={{ fontSize: '56px', fontWeight: 700, color: colors.ink, lineHeight: 1, letterSpacing: '-0.04em' }}
      >
        {value}
        <span style={{ fontSize: '20px', color: colors.muted, marginLeft: '4px', fontWeight: 500 }}>min</span>
      </motion.div>
      <div style={{ fontSize: '13px', color: colors.muted, marginTop: '6px' }}>per day</div>
    </div>
  );
}
