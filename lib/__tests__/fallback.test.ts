import { describe, it, expect } from 'vitest';
import { fallbackFrame, WELLBEING_RISK_RE } from '@/lib/fallback';
import { CRISIS_RESOURCE_TEXT } from '@/lib/prompts';

describe('WELLBEING_RISK_RE', () => {
  const matches = [
    'I want to end it',
    'thinking about suicide',
    'I will kill myself',
    "I can't go on anymore",
    'I want to hurt myself',
    'self-harm thoughts',
    'I feel unsafe',
    'panic attack',
    'going to hurt someone',
  ];
  for (const m of matches) {
    it(`matches: ${m}`, () => {
      expect(WELLBEING_RISK_RE.test(m)).toBe(true);
    });
  }

  const nonMatches = [
    "I'm frustrated with the deadline",
    'I had a rough day',
    "I'm feeling low",
    'I disagree with the decision',
  ];
  for (const m of nonMatches) {
    it(`does not match: ${m}`, () => {
      expect(WELLBEING_RISK_RE.test(m)).toBe(false);
    });
  }
});

describe('fallbackFrame', () => {
  it('returns critical with wellbeing_risk when crisis pattern matches', () => {
    const frame = fallbackFrame("I can't go on anymore.");
    expect(frame.sensitivity_level).toBe('critical');
    expect(frame.wellbeing_risk).toBe(true);
    expect(frame.guidance).toContain(CRISIS_RESOURCE_TEXT);
  });

  it('returns medium consequential when no crisis pattern matches', () => {
    const frame = fallbackFrame('I am annoyed about the meeting.');
    expect(frame.sensitivity_level).toBe('medium');
    expect(frame.is_consequential).toBe(true);
    expect(frame.wellbeing_risk).toBe(false);
  });
});
