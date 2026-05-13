import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildCareerTelegramMessage } from '@/features/career-funnel/utils/buildCareerTelegramMessage';

const careerSubmitSchema = z.object({
  timestamp: z.string(),
  answers: z.object({
    q1: z.string().optional(),
    q2: z.string().optional(),
    q3: z.string().optional(),
    q4: z.number().optional(),
    q6: z.number().optional(),
    q7: z.string().optional(),
    q8: z.number().optional(),
    q9: z.string().optional(),
    q10: z.string().email(),
  }),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = careerSubmitSchema.safeParse(body);
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

  const message = buildCareerTelegramMessage(parsed.data);

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
