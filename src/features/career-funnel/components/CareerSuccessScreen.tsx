'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCareerStore } from '../store/career-funnel.store';
import { colors } from '../config/career-funnel.config';
import type { CareerAnswers } from '../types/career-funnel.types';

type CareerSuccessScreenProps = {
  answers: CareerAnswers;
};

function ImagePlaceholder({ prompt, aspect = '16/9', label }: { prompt: string; aspect?: string; label: string }) {
  return (
    <div style={{
      width: '100%',
      aspectRatio: aspect,
      background: `repeating-linear-gradient(45deg, ${colors.creamDeep}, ${colors.creamDeep} 10px, ${colors.cream} 10px, ${colors.cream} 20px)`,
      border: `2px dashed ${colors.border}`,
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: colors.coral, letterSpacing: '0.1em', marginBottom: '8px', textTransform: 'uppercase' as const }}>
        🍌 Nanobanana Slot — {label}
      </div>
      <div style={{ fontSize: '12px', color: colors.muted, fontStyle: 'italic', lineHeight: 1.5, maxWidth: '90%' }}>
        {prompt}
      </div>
    </div>
  );
}

function NextStep({ n, text }: { n: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%', background: colors.ink,
        color: colors.cream, fontSize: '12px', fontWeight: 700, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {n}
      </div>
      <div style={{ fontSize: '13px', color: colors.inkSoft, lineHeight: 1.5, paddingTop: '3px' }}>
        {text}
      </div>
    </div>
  );
}

export function CareerSuccessScreen({ answers }: CareerSuccessScreenProps) {
  const { reset } = useCareerStore();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', maxWidth: '480px', margin: '0 auto', textAlign: 'center',
    }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' as const, stiffness: 200, damping: 16, delay: 0.05 }}
        style={{
          width: '80px', height: '80px', borderRadius: '50%', background: colors.coral,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px', boxShadow: `0 12px 32px ${colors.coral}40`,
        }}
      >
        <Check size={40} color="#fff" strokeWidth={3} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ fontSize: '30px', fontWeight: 700, color: colors.ink, lineHeight: 1.15, marginBottom: '14px', letterSpacing: '-0.02em' }}
      >
        Your plan is on the way.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ fontSize: '15px', color: colors.inkSoft, lineHeight: 1.5, marginBottom: '32px' }}
      >
        Check <strong>{answers.q10}</strong> in the next 2 minutes. Your first lesson is already inside.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ width: '100%', marginBottom: '24px' }}
      >
        <ImagePlaceholder
          aspect="4/3"
          label="SUCCESS"
          prompt="Same person from the hero image, now smiling slightly, looking at their phone. Warm lighting. Subtle hint of accomplishment. Editorial photography style."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          width: '100%', padding: '20px', background: colors.creamDeep,
          borderRadius: '14px', marginBottom: '20px', textAlign: 'left',
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 700, color: colors.coral, letterSpacing: '0.1em', marginBottom: '10px' }}>
          WHAT HAPPENS NEXT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <NextStep n="1" text="Open the email — your plan is the first thing inside." />
          <NextStep n="2" text="Try your first AI roleplay (no app install needed)." />
          <NextStep n="3" text="Day 7: we check in and adjust your plan." />
        </div>
      </motion.div>

      <div style={{ fontSize: '12px', color: colors.muted, marginBottom: '24px' }}>
        Didn&apos;t get it? Check spam, or reply to any LinguaAI email.
      </div>

      <button
        onClick={reset}
        style={{ fontSize: '12px', color: colors.muted, background: 'none', border: 'none', cursor: 'pointer' }}
      >
        Start over
      </button>
    </div>
  );
}
