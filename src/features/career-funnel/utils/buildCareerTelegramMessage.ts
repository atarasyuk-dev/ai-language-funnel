import type { CareerSubmitPayload } from '../types/career-funnel.types';

const goalLabels: Record<string, string> = {
  meetings: 'Speaking up in meetings',
  interviews: 'Job interviews',
  emails: 'Professional writing',
  presentations: 'Presentations & demos',
};

const subContextLabels: Record<string, string> = {
  standups: 'Daily standups',
  clientcalls: 'Client calls',
  brainstorms: 'Brainstorms & debates',
  leadership: 'Talking to leadership',
  tech: 'Technical interviews',
  behavioral: 'Behavioral rounds',
  screening: 'Recruiter screens',
  panel: 'Panel / final rounds',
  clients: 'Client communication',
  internal: 'Internal updates',
  sensitive: 'Difficult conversations',
  cold: 'Cold outreach',
  execs: 'Executive reviews',
  demos: 'Product demos',
  conferences: 'Conferences & panels',
  team: 'Team presentations',
};

const blockerLabels: Record<string, string> = {
  freeze: 'I freeze and forget words I know',
  translate: 'I translate in my head — too slow',
  pronunciation: "I'm self-conscious about my accent",
  vocabulary: 'I lack the specific work vocabulary',
};

const frequencyLabels: Record<number, string> = {
  1: 'Rarely (< 1×/month)',
  2: 'Sometimes (1-2×/month)',
  3: 'Often (almost every week)',
  4: 'Constantly (multiple times/week)',
  5: 'Every day',
};

const pastAttemptLabels: Record<string, string> = {
  apps: 'Apps (Duolingo, Babbel)',
  tutor: 'Generic tutors on iTalki',
  youtube: 'YouTube & podcasts',
  never: "Haven't really tried before",
};

const deadlineLabels: Record<string, string> = {
  '4w': '4 weeks',
  '8w': '8 weeks',
  '12w': '12 weeks',
  open: 'No deadline',
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
}

export function buildCareerTelegramMessage(payload: CareerSubmitPayload): { text: string; parse_mode: string } {
  const { answers, timestamp } = payload;

  const lines = [
    `<b>Q1 – Main goal:</b> ${goalLabels[answers.q1 ?? ''] ?? answers.q1 ?? '—'}`,
    `<b>Q2 – Specific context:</b> ${subContextLabels[answers.q2 ?? ''] ?? answers.q2 ?? '—'}`,
    `<b>Q3 – Blocker:</b> ${blockerLabels[answers.q3 ?? ''] ?? answers.q3 ?? '—'}`,
    `<b>Q4 – Frequency:</b> ${answers.q4 !== undefined ? (frequencyLabels[answers.q4] ?? `${answers.q4}`) : '—'}`,
    `<b>Q6 – Daily time:</b> ${answers.q6 !== undefined ? `${answers.q6} min/day` : '—'}`,
    `<b>Q7 – Past attempts:</b> ${pastAttemptLabels[answers.q7 ?? ''] ?? answers.q7 ?? '—'}`,
    `<b>Q8 – Confidence (1-5):</b> ${answers.q8 ?? '—'}`,
    `<b>Q9 – Deadline:</b> ${deadlineLabels[answers.q9 ?? ''] ?? answers.q9 ?? '—'}`,
  ].join('\n');

  const text = [
    '💼 <b>New Career Funnel Lead</b>',
    '',
    `📅 <b>Submitted:</b> ${formatTimestamp(timestamp)}`,
    `📧 <b>Email:</b> ${answers.q10 ?? '—'}`,
    '',
    '<b>── Answers ──</b>',
    lines,
  ].join('\n');

  return { text, parse_mode: 'HTML' };
}
