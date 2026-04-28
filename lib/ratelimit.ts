import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createHash } from 'node:crypto';

const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '24 h'),
  analytics: true,
  prefix: 'bodhisattva-web:try',
});

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
  const { success, remaining, reset } = await limiter.limit(identifier);
  return {
    ok: success,
    remaining,
    resetSeconds: Math.max(0, Math.ceil((reset - Date.now()) / 1000)),
  };
}
