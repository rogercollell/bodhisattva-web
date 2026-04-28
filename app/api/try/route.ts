import { NextResponse } from 'next/server';
import { runFraming } from '@/lib/frame';
import { checkRateLimit, ipFromHeaders } from '@/lib/ratelimit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_PAYLOAD_BYTES = 4096;

interface TryRequestBody {
  draft?: unknown;
  recipient_context?: unknown;
}

export async function POST(req: Request): Promise<Response> {
  let body: TryRequestBody;
  try {
    body = (await req.json()) as TryRequestBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const draft = typeof body.draft === 'string' ? body.draft.trim() : '';
  const recipientContext =
    typeof body.recipient_context === 'string' ? body.recipient_context.trim() : '';

  if (!draft) {
    return NextResponse.json({ error: 'empty_draft' }, { status: 400 });
  }

  const totalBytes = Buffer.byteLength(draft + recipientContext, 'utf8');
  if (totalBytes > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 });
  }

  const ip = ipFromHeaders(req.headers);
  const limit = await checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: 'rate_limit',
        message:
          "You've used today's free framings. Install locally to wire it into your AI agent — no limit, no shared server.",
        reset_seconds: limit.resetSeconds,
      },
      { status: 429 },
    );
  }

  try {
    const result = await runFraming({ draft, recipientContext });
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'frame_failed' }, { status: 502 });
  }
}
