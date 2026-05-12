// src/app/api/submit/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildTelegramMessage } from '@/features/funnel/utils/buildTelegramMessage';

const submitSchema = z.object({
  timestamp: z.string(),
  answers: z.object({
    goal: z.string().optional(),
    level: z.string().optional(),
    motivation: z.string().optional(),
    painPoint: z.string().optional(),
    timeline: z.string().optional(),
    learningStyle: z.string().optional(),
    dailyCommitment: z.string().optional(),
    confidence: z.number().optional(),
    planPreference: z.string().optional(),
    email: z.string().email(),
  }),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (process.env.SKIP_TELEGRAM === 'true') {
    return NextResponse.json({ success: true });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const message = buildTelegramMessage(parsed.data);

  let telegramRes: Response;
  try {
    telegramRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, ...message }),
      },
    );
  } catch (err) {
    console.error('Telegram fetch failed:', err);
    return NextResponse.json({ error: 'Failed to reach Telegram.' }, { status: 502 });
  }

  if (!telegramRes.ok) {
    const errBody = await telegramRes.json().catch(() => ({}));
    console.error('Telegram API error:', errBody);
    return NextResponse.json({ error: 'Telegram delivery failed.' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
