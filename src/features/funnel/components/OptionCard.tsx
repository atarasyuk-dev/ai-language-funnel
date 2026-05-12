// src/features/funnel/components/OptionCard.tsx
'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { FunnelOption } from '../types/funnel.types';

type OptionCardProps = {
  option: FunnelOption;
  isSelected: boolean;
  onSelect: () => void;
  multiSelect?: boolean;
};

export function OptionCard({ option, isSelected, onSelect, multiSelect = false }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 bg-white transition-colors duration-150 cursor-pointer',
        isSelected
          ? 'border-violet-500 bg-violet-50'
          : 'border-slate-100 hover:border-violet-200',
      )}
    >
      {option.emoji && (
        <span className="text-2xl flex-shrink-0 leading-none">{option.emoji}</span>
      )}

      <div className="flex-1 min-w-0">
        <p className={cn('font-semibold text-slate-800 leading-snug', isSelected && 'text-violet-700')}>
          {option.label}
        </p>
        {option.description && (
          <p className="text-sm text-slate-400 mt-0.5 leading-snug">{option.description}</p>
        )}
      </div>

      <motion.div
        initial={false}
        animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="flex-shrink-0"
      >
        <CheckCircle2 className="w-5 h-5 text-violet-500" />
      </motion.div>
    </motion.button>
  );
}
