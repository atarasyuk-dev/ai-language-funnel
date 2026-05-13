'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Lock, AlertCircle, Target, Zap } from 'lucide-react';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../config/career-funnel.config';
import { getPlanPreviewData, getGoalLabel } from '../utils/getCareerPersonalizedCopy';
import type { CareerAnswers } from '../types/career-funnel.types';

type CareerEmailStepProps = {
  answers: CareerAnswers;
  onSubmit: (email: string) => void;
  isSubmitting: boolean;
  error: string | null;
};

type PlanFeatureProps = {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  text: string;
};

function PlanFeature({ icon: Icon, text }: PlanFeatureProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px',
        background: `${colors.coral}25`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={14} color={colors.coral} strokeWidth={2.5} />
      </div>
      <div style={{ fontSize: '13px', color: colors.creamDeep, lineHeight: 1.4 }}>{text}</div>
    </div>
  );
}

function ProgressGraph({ startLevel, targetLevel, weeks }: { startLevel: number; targetLevel: number; weeks: number }) {
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= weeks; i++) {
    const progress = i / weeks;
    const eased = 1 - Math.pow(1 - progress, 1.6);
    const level = startLevel + (targetLevel - startLevel) * eased;
    points.push({ x: (i / weeks) * 100, y: 100 - (level / 5) * 80 - 10 });
  }
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const last = points[points.length - 1];

  return (
    <div style={{ background: `${colors.cream}10`, borderRadius: '12px', padding: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: colors.creamDeep, marginBottom: '8px' }}>
        <span>Level {startLevel} today</span>
        <span style={{ color: colors.coral, fontWeight: 600 }}>Level {targetLevel} in {weeks}w</span>
      </div>
      <svg viewBox="0 0 100 60" style={{ width: '100%', height: '60px', display: 'block' }}>
        <defs>
          <linearGradient id="career-email-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.coral} stopOpacity={0.4} />
            <stop offset="100%" stopColor={colors.coral} stopOpacity={0} />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map(y => (
          <line key={y} x1="0" y1={y / 100 * 60} x2="100" y2={y / 100 * 60} stroke={colors.cream} strokeOpacity={0.1} strokeWidth={0.3} />
        ))}
        <path d={`${pathD} L 100 60 L 0 60 Z`} fill="url(#career-email-gradient)" />
        <path d={pathD} fill="none" stroke={colors.coral} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="300" strokeDashoffset="300"
          style={{ animation: 'drawLine 1.4s ease-out forwards' }}
        />
        <circle cx={last.x} cy={last.y} r={2} fill={colors.coral} />
      </svg>
      <style>{`@keyframes drawLine { to { stroke-dashoffset: 0; } }`}</style>
    </div>
  );
}

export function CareerEmailStep({ answers, onSubmit, isSubmitting, error }: CareerEmailStepProps) {
  const [email, setEmail] = useState(answers.q10 ?? '');
  const [localError, setLocalError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const { timeStr, goalLabel, startLevel, targetLevel, weeks } = getPlanPreviewData(answers);
  const blockerLabel = answers.q3 ? answers.q3.replace('_', ' ') : 'your specific blocker';

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // debounced validation (mirrors main funnel's EmailStep)
  useEffect(() => {
    if (!touched || email.length === 0) { setLocalError(null); return; }
    const timer = setTimeout(() => {
      setLocalError(isValid ? null : 'Please enter a valid email address.');
    }, 500);
    return () => clearTimeout(timer);
  }, [email, touched, isValid]);

  function handleSubmit() {
    if (!isValid) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    onSubmit(email);
  }

  const displayError = error ?? localError;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '100px' }}>
      {/* Plan preview card */}
      <div style={{
        background: colors.ink, borderRadius: '20px', padding: '24px',
        color: colors.cream, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ fontSize: '11px', color: colors.coral, fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px' }}>
          YOUR PERSONALIZED PATH
        </div>
        <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', lineHeight: 1.3 }}>
          {timeStr}-a-day plan for {goalLabel}
        </div>
        <ProgressGraph startLevel={startLevel} targetLevel={targetLevel} weeks={weeks} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <PlanFeature icon={Target} text={`Daily focus: ${getGoalLabel(answers.q1)}`} />
          <PlanFeature icon={Brain} text={`Tuned to fix: ${blockerLabel}`} />
          <PlanFeature icon={Zap} text="AI roleplay scenarios with instant feedback" />
        </div>
      </div>

      {/* Email capture */}
      <div style={{
        background: colors.cream,
        border: `2px solid ${displayError ? colors.coral : colors.border}`,
        borderRadius: '14px',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Lock size={16} color={colors.coral} />
          <div style={{ fontSize: '14px', fontWeight: 600, color: colors.ink }}>Unlock your plan</div>
        </div>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setTouched(true); setLocalError(null); }}
          placeholder="you@work.com"
          style={{
            width: '100%',
            padding: '14px 16px',
            border: `1.5px solid ${displayError ? colors.coral : colors.border}`,
            borderRadius: '10px',
            fontSize: '15px',
            background: '#fff',
            color: colors.ink,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border 0.2s',
          }}
        />
        {displayError && (
          <div style={{ fontSize: '12px', color: colors.coral, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={12} /> {displayError}
          </div>
        )}
        <div style={{ fontSize: '11px', color: colors.muted, marginTop: '10px', lineHeight: 1.5 }}>
          We email your plan + first lesson immediately. No spam, unsubscribe in one click.
        </div>
      </div>

      {/* Submit button */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '16px 20px 24px',
        background: `linear-gradient(180deg, transparent, ${colors.cream} 30%)`,
        pointerEvents: 'none',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', pointerEvents: 'auto' }}>
          <motion.button
            onClick={handleSubmit}
            disabled={!email || isSubmitting}
            whileHover={{ translateY: !email || isSubmitting ? 0 : -1 }}
            whileTap={{ scale: !email || isSubmitting ? 1 : 0.98 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
            style={{
              width: '100%', padding: '16px',
              background: !email || isSubmitting ? colors.creamDeep : colors.coral,
              color: !email || isSubmitting ? colors.muted : '#fff',
              border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 600,
              cursor: !email || isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: !email || isSubmitting ? 'none' : `0 8px 24px ${colors.coral}40`,
            }}
          >
            {isSubmitting ? 'Sending your plan…' : 'Send my plan'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
