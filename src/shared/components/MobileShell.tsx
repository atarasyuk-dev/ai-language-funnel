// src/shared/components/MobileShell.tsx
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

type MobileShellProps = {
  children: ReactNode;
  className?: string;
};

export function MobileShell({ children, className }: MobileShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-start justify-center">
      <div
        className={cn(
          'w-full max-w-md min-h-screen flex flex-col px-5 pt-6 pb-10',
          'sm:min-h-0 sm:my-8 sm:rounded-3xl sm:shadow-xl sm:border sm:border-violet-100 sm:bg-white',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
