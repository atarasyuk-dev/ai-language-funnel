// src/app/page.tsx
import { MobileShell } from '@/shared/components/MobileShell';
import { Funnel } from '@/features/funnel/components/Funnel';

export default function Home() {
  return (
    <MobileShell>
      <Funnel />
    </MobileShell>
  );
}
