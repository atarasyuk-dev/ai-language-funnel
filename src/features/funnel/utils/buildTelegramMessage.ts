// src/features/funnel/utils/buildTelegramMessage.ts
import type { SubmitPayload, TelegramMessage } from '../types/funnel.types';

const questionLabels: Record<string, string> = {
  goal: 'Main Goal',
  level: 'Current Level',
  motivation: 'Motivation',
  painPoint: 'Biggest Challenge',
  timeline: 'Target Timeline',
  learningStyle: 'Learning Style',
  dailyCommitment: 'Daily Commitment',
  confidence: 'Confidence Score',
  planPreference: 'Plan Preference',
  email: 'Email',
};

const answerLabels: Record<string, Record<string, string>> = {
  goal: { career: 'Advance my career', travel: 'Travel with confidence', confidence: 'Speak without hesitation', exam: 'Pass an English exam' },
  level: { beginner: 'Beginner', elementary: 'Elementary', intermediate: 'Intermediate', advanced: 'Advanced' },
  motivation: { opportunity: 'A specific opportunity is coming', embarrassed: "I'm tired of feeling embarrassed", stuck: "I've been stuck too long", inspired: 'Something finally inspired me' },
  painPoint: { speaking: 'Speaking — mind goes blank', grammar: 'Grammar — second-guessing', vocabulary: 'Vocabulary — running out of words', listening: 'Listening — natives too fast' },
  timeline: { '1month': 'Within 1 month', '3months': 'Within 3 months', '6months': 'Within 6 months', flexible: 'No rush' },
  learningStyle: { conversation: 'Real conversations', structured: 'Structured lessons', immersion: 'Immersion & context', games: 'Games & challenges' },
  dailyCommitment: { '5min': '5 minutes', '10min': '10 minutes', '20min': '20 minutes', '30min': '30+ minutes' },
  planPreference: { yes: 'Confirmed' },
};

function formatAnswer(field: string, value: string | number | undefined): string {
  if (value === undefined || value === '') return '—';
  if (field === 'confidence') return `${value}/10`;
  if (typeof value === 'string') {
    return answerLabels[field]?.[value] ?? value;
  }
  return String(value);
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
}

export function buildTelegramMessage(payload: SubmitPayload): TelegramMessage {
  const { answers, timestamp } = payload;

  const qaLines = (Object.keys(questionLabels) as Array<keyof typeof questionLabels>)
    .filter((key) => key !== 'email')
    .map((key) => {
      const label = questionLabels[key];
      const value = formatAnswer(key, answers[key as keyof typeof answers]);
      return `<b>${label}:</b> ${value}`;
    })
    .join('\n');

  const text = [
    '🎯 <b>New Language Tutor Lead</b>',
    '',
    `📅 <b>Submitted:</b> ${formatTimestamp(timestamp)}`,
    `📧 <b>Email:</b> ${answers.email ?? '—'}`,
    '',
    '<b>── Answers ──</b>',
    qaLines,
  ].join('\n');

  return { text, parse_mode: 'HTML' };
}
