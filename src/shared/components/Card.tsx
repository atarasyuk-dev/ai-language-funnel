'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

type CardProps = {
  children: ReactNode;
  selectable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export function Card({ children, selectable, selected, onClick, className }: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={selectable ? { y: -2 } : undefined}
      whileTap={selectable ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'bg-white rounded-2xl p-4 shadow-sm border-2 transition-colors duration-150',
        selectable && 'cursor-pointer',
        selected
          ? 'border-violet-500 bg-violet-50'
          : 'border-transparent hover:border-violet-200',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
