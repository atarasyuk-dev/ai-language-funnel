'use client';

import { Sparkles, Check } from 'lucide-react';
import { colors } from '../config/career-funnel.config';
import { getBlockerInsight } from '../utils/getCareerPersonalizedCopy';
import type { CareerAnswers } from '../types/career-funnel.types';

type CareerInsightStepProps = {
  answers: CareerAnswers;
};

export function CareerInsightStep({ answers }: CareerInsightStepProps) {
  const insight = getBlockerInsight(answers.q3, answers);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
        color: colors.coral, textTransform: 'uppercase' as const,
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <Sparkles size={13} /> AI Insight · Based on your answers
      </div>

      <h2 style={{
        fontSize: '28px', fontWeight: 700, color: colors.ink,
        lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0,
      }}>
        {insight.headline}
      </h2>

      <p style={{ fontSize: '15px', color: colors.inkSoft, lineHeight: 1.6, margin: 0 }}>
        {insight.body}
      </p>

      <div style={{
        background: colors.ink, borderRadius: '18px', padding: '24px', color: colors.cream,
      }}>
        <div style={{
          fontSize: '48px', fontWeight: 700, color: colors.coral,
          lineHeight: 1, marginBottom: '6px', letterSpacing: '-0.03em',
        }}>
          {insight.stat}
        </div>
        <div style={{ fontSize: '13px', color: colors.creamDeep, lineHeight: 1.4 }}>
          {insight.statLabel}
        </div>
      </div>

      <div style={{
        padding: '14px 16px', background: colors.sageSoft, borderRadius: '12px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <Check size={16} color={colors.sage} strokeWidth={3} />
        <span style={{ fontSize: '13px', color: colors.inkSoft }}>
          We&apos;re already shaping your plan around this.
        </span>
      </div>
    </div>
  );
}
