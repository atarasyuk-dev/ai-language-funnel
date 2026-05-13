import type { Metadata } from 'next';
import CareerFunnelClient from './CareerFunnelClient';

export const metadata: Metadata = {
  title: 'LinguaAI — Career English',
  description: 'Stop freezing in English at work. AI-powered diagnosis and personalized plan in 90 seconds.',
};

export default function CareerPage() {
  return <CareerFunnelClient />;
}
