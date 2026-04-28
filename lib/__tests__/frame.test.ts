import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { WisdomFrame } from '@/lib/schema';

const generateTextMock = vi.fn();

vi.mock('ai', () => ({
  generateText: (...args: unknown[]) => generateTextMock(...args),
  // Minimal stub for Output.object — the real implementation returns a tagged
  // descriptor; the mock just needs to be callable and pass-through.
  Output: { object: (opts: unknown) => ({ __outputObject: opts }) },
}));

import { decide, runFraming } from '@/lib/frame';

const benignFrame: WisdomFrame = {
  emotional_context: 'routine',
  sensitivity_level: 'low',
  is_consequential: false,
  consequential_reason: null,
  wellbeing_risk: false,
  affected_parties: ['user'],
  recommended_posture: 'send',
  guidance: 'no concerns',
  reflection_invitation: null,
};

const consequentialFrame: WisdomFrame = {
  emotional_context: 'frustrated',
  sensitivity_level: 'high',
  is_consequential: true,
  consequential_reason: 'reactive',
  wellbeing_risk: false,
  affected_parties: ['user', 'manager'],
  recommended_posture: 'reframe',
  guidance: 'soften but keep substance',
  reflection_invitation: 'pause?',
};

const criticalFrame: WisdomFrame = {
  ...benignFrame,
  sensitivity_level: 'critical',
  guidance: 'reach out immediately',
};

describe('decide', () => {
  it('returns hold when sensitivity_level is critical', () => {
    expect(decide(criticalFrame).decision).toBe('hold');
  });

  it('returns hold when wellbeing_risk is true', () => {
    expect(
      decide({ ...benignFrame, wellbeing_risk: true }).decision,
    ).toBe('hold');
  });

  it('returns revise when consequential and not critical', () => {
    expect(decide(consequentialFrame).decision).toBe('revise');
  });

  it('returns proceed when neither critical nor consequential', () => {
    expect(decide(benignFrame).decision).toBe('proceed');
  });
});

describe('runFraming', () => {
  beforeEach(() => {
    generateTextMock.mockReset();
  });

  // Both LLM calls go through generateText. The wisdom-frame call passes
  // `output: Output.object(...)` and we read the parsed `output` field; the
  // revision call passes only a prompt and we read the `text` field. The
  // mock dispatches based on which arg shape it sees.

  it('returns proceed for benign drafts (no revision call)', async () => {
    generateTextMock.mockImplementationOnce(async (opts: { output?: unknown }) => {
      expect(opts.output).toBeDefined();
      return { output: benignFrame, text: '' };
    });
    const result = await runFraming({ draft: 'Hi mom', recipientContext: 'My mother' });
    expect(result.decision).toBe('proceed');
    expect(result.suggested_revision).toBeNull();
    expect(generateTextMock).toHaveBeenCalledTimes(1);
  });

  it('calls the revision model when consequential and returns revise', async () => {
    generateTextMock
      .mockImplementationOnce(async () => ({ output: consequentialFrame, text: '' }))
      .mockImplementationOnce(async (opts: { output?: unknown }) => {
        expect(opts.output).toBeUndefined();
        return { output: undefined, text: 'Hi Alice — I want to flag a concern.' };
      });
    const result = await runFraming({
      draft: 'This is unreasonable.',
      recipientContext: 'My manager',
    });
    expect(result.decision).toBe('revise');
    expect(result.suggested_revision).toContain('Hi Alice');
    expect(generateTextMock).toHaveBeenCalledTimes(2);
  });

  it('downgrades to hold when revision call fails', async () => {
    generateTextMock
      .mockImplementationOnce(async () => ({ output: consequentialFrame, text: '' }))
      .mockRejectedValueOnce(new Error('boom'));
    const result = await runFraming({
      draft: 'This is unreasonable.',
      recipientContext: 'My manager',
    });
    expect(result.decision).toBe('hold');
    expect(result.suggested_revision).toBeNull();
  });

  it('uses the fallback frame and returns hold when frame call fails on a crisis draft', async () => {
    generateTextMock.mockRejectedValueOnce(new Error('llm down'));
    const result = await runFraming({
      draft: "I can't go on anymore.",
      recipientContext: 'My sister',
    });
    expect(result.decision).toBe('hold');
    expect(result.wisdom_frame.wellbeing_risk).toBe(true);
  });
});
