import { describe, it, expect, vi, beforeEach } from 'vitest';

const runFramingMock = vi.fn();
const checkRateLimitMock = vi.fn();
const ipFromHeadersMock = vi.fn();

vi.mock('@/lib/frame', () => ({ runFraming: (...a: unknown[]) => runFramingMock(...a) }));
vi.mock('@/lib/ratelimit', () => ({
  checkRateLimit: (...a: unknown[]) => checkRateLimitMock(...a),
  ipFromHeaders: (...a: unknown[]) => ipFromHeadersMock(...a),
}));

import { POST } from '@/app/api/try/route';

function makeRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request('http://localhost/api/try', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

describe('POST /api/try', () => {
  beforeEach(() => {
    runFramingMock.mockReset();
    checkRateLimitMock.mockReset();
    ipFromHeadersMock.mockReset();
    ipFromHeadersMock.mockReturnValue('1.2.3.4');
    checkRateLimitMock.mockResolvedValue({ ok: true, remaining: 4, resetSeconds: 3600 });
  });

  it('rejects empty draft with 400', async () => {
    const res = await POST(makeRequest({ draft: '   ', recipient_context: 'x' }));
    expect(res.status).toBe(400);
  });

  it('rejects oversized payload with 413', async () => {
    const huge = 'x'.repeat(5000);
    const res = await POST(makeRequest({ draft: huge, recipient_context: '' }));
    expect(res.status).toBe(413);
  });

  it('returns 429 with rate_limit error when blocked', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ ok: false, remaining: 0, resetSeconds: 100 });
    const res = await POST(makeRequest({ draft: 'Hi', recipient_context: '' }));
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toBe('rate_limit');
  });

  it('returns 200 with the framing response on success', async () => {
    runFramingMock.mockResolvedValueOnce({
      decision: 'proceed',
      wisdom_frame: {
        emotional_context: 'x',
        sensitivity_level: 'low',
        is_consequential: false,
        consequential_reason: null,
        wellbeing_risk: false,
        affected_parties: ['user'],
        recommended_posture: 'x',
        guidance: 'x',
        reflection_invitation: null,
      },
      suggested_revision: null,
    });
    const res = await POST(makeRequest({ draft: 'Hi mom', recipient_context: 'My mother' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.decision).toBe('proceed');
  });
});
