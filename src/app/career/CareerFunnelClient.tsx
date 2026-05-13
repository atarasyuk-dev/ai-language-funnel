'use client';

import dynamic from 'next/dynamic';

const CareerFunnel = dynamic(
  () => import('@/features/career-funnel/components/CareerFunnel').then(m => ({ default: m.CareerFunnel })),
  { ssr: false },
);

export default function CareerFunnelClient() {
  return <CareerFunnel />;
}
