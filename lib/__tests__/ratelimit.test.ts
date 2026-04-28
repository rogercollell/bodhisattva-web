import { describe, it, expect, vi, beforeAll } from 'vitest';

const limitMock = vi.fn();

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class {
    static slidingWindow(_limit: number, _window: string) {
      return {};
    }
    constructor(_opts: unknown) {}
    limit(...args: unknown[]) {
      return limitMock(...args);
    }
  },
}));

vi.mock('@upstash/redis', () => ({
  Redis: class {
    constructor(_opts: unknown) {}
  },
}));

beforeAll(() => {
  process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
});

import { checkRateLimit, ipFromHeaders } from '@/lib/ratelimit';

describe('ipFromHeaders', () => {
  it('uses the first hop of x-forwarded-for', () => {
    const h = new Headers({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' });
    expect(ipFromHeaders(h)).toBe('1.2.3.4');
  });

  it('falls back to a UA-based hash when x-forwarded-for is missing', () => {
    const h = new Headers({ 'user-agent': 'curl/8' });
    expect(ipFromHeaders(h)).toMatch(/^anon:/);
  });
});

describe('checkRateLimit', () => {
  it('returns ok when the limiter says success', async () => {
    limitMock.mockResolvedValueOnce({ success: true, remaining: 4, reset: Date.now() + 1000 });
    const result = await checkRateLimit('1.2.3.4');
    expect(result.ok).toBe(true);
  });

  it('returns blocked when the limiter says fail', async () => {
    limitMock.mockResolvedValueOnce({ success: false, remaining: 0, reset: Date.now() + 1000 });
    const result = await checkRateLimit('1.2.3.4');
    expect(result.ok).toBe(false);
  });
});
