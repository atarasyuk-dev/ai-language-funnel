'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../config/career-funnel.config';

type CareerWelcomeProps = {
  onStart: () => void;
};


export function CareerWelcome({ onStart }: CareerWelcomeProps) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 20px',
      maxWidth: '480px',
      margin: '0 auto',
    }}>
      <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.15em', color: colors.ink, marginBottom: '40px' }}>
        LINGUA<span style={{ color: colors.coral }}>AI</span>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <img
          src="/hero.png"
          alt="Professional in a meeting"
          style={{ width: '100%', aspectRatio: '4/3', borderRadius: '16px', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <h1 style={{
        fontSize: '34px', fontWeight: 700, lineHeight: 1.1, color: colors.ink,
        letterSpacing: '-0.03em', marginBottom: '14px',
      }}>
        Stop freezing in English at work.
      </h1>
      <p style={{ fontSize: '16px', lineHeight: 1.5, color: colors.inkSoft, marginBottom: '32px' }}>
        In 90 seconds, our AI diagnoses what&apos;s actually holding you back — and builds a plan that fits 15 minutes a day.
      </p>

      <motion.button
        onClick={onStart}
        whileHover={{ translateY: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
        style={{
          padding: '18px', background: colors.coral, color: '#fff', border: 'none',
          borderRadius: '14px', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: `0 12px 32px ${colors.coral}40`,
        }}
      >
        Start free diagnosis
        <ArrowRight size={18} />
      </motion.button>

      <div style={{
        marginTop: '20px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '6px', fontSize: '12px', color: colors.muted,
      }}>
        <Sparkles size={13} color={colors.coral} />
        Used by 18,000+ professionals · No signup to start
      </div>
    </div>
  );
}
