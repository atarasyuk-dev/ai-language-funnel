'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../config/career-funnel.config';
import type { CareerOption } from '../types/career-funnel.types';

type CareerOptionCardProps = {
  option: CareerOption;
  isSelected: boolean;
  onSelect: () => void;
};

export function CareerOptionCard({ option, isSelected, onSelect }: CareerOptionCardProps) {
  const { icon: Icon, iconColor, label, sub } = option;

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: isSelected ? 1 : 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
      style={{
        width: '100%',
        padding: '16px 18px',
        background: isSelected ? colors.ink : colors.cream,
        border: `2px solid ${isSelected ? colors.ink : colors.border}`,
        borderRadius: '14px',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: isSelected ? `0 8px 24px ${colors.ink}25` : `0 1px 0 ${colors.border}50`,
      }}
    >
      {(Icon || iconColor) && (
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: isSelected ? colors.coral : (iconColor ? `${iconColor}20` : colors.creamDeep),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {Icon && (
            <Icon
              size={20}
              color={isSelected ? '#fff' : (iconColor ?? colors.inkSoft)}
              strokeWidth={2.2}
            />
          )}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '15px',
          fontWeight: 600,
          color: isSelected ? colors.cream : colors.ink,
          marginBottom: sub ? '2px' : 0,
          lineHeight: 1.3,
        }}>
          {label}
        </div>
        {sub && (
          <div style={{ fontSize: '12px', color: isSelected ? colors.creamDeep : colors.muted, lineHeight: 1.4 }}>
            {sub}
          </div>
        )}
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' as const, stiffness: 400, damping: 20 }}
        >
          <Check size={18} color={colors.coral} strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  );
}
