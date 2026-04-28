import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createHash } from 'node:crypto';

let cachedLimiter: Ratelimit | null = null;

function getLimiter(): Ratelimit {
  if (cachedLimiter) return cachedLimiter;
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      'Missing Upstash Redis env vars: set UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN.',
    );
  }
  cachedLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, '24 h'),
    analytics: true,
    prefix: 'bodhisattva-web:try',
  });
  return cachedLimiter;
}

export function ipFromHeaders(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) {
    const first = fwd.split(',')[0]?.trim();
    if (first) return first;
  }
  const ua = headers.get('user-agent') ?? 'unknown';
  return 'anon:' + createHash('sha256').update(ua).digest('hex').slice(0, 16);
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetSeconds: number;
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const { success, remaining, reset } = await getLimiter().limit(identifier);
  return {
    ok: success,
    remaining,
    resetSeconds: Math.max(0, Math.ceil((reset - Date.now()) / 1000)),
  };
}
