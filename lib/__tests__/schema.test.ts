import { describe, it, expect } from 'vitest';
import { WisdomFrameSchema, FramingResponseSchema } from '@/lib/schema';

describe('WisdomFrameSchema', () => {
  it('accepts a complete valid frame', () => {
    const parsed = WisdomFrameSchema.parse({
      emotional_context: 'frustrated, drafting in heat',
      sensitivity_level: 'high',
      is_consequential: true,
      consequential_reason: 'reactive language to manager',
      wellbeing_risk: false,
      affected_parties: ['user', 'alice'],
      recommended_posture: 'lead with the concrete concern',
      guidance: 'reframe before sending',
      reflection_invitation: 'pause for a beat?',
    });
    expect(parsed.sensitivity_level).toBe('high');
  });

  it('rejects an unknown sensitivity_level', () => {
    expect(() =>
      WisdomFrameSchema.parse({
        emotional_context: 'x',
        sensitivity_level: 'spicy',
        is_consequential: false,
        consequential_reason: null,
        wellbeing_risk: false,
        affected_parties: [],
        recommended_posture: 'x',
        guidance: 'x',
        reflection_invitation: null,
      }),
    ).toThrow();
  });
});

describe('FramingResponseSchema', () => {
  it('accepts a proceed response with null revision', () => {
    const parsed = FramingResponseSchema.parse({
      decision: 'proceed',
      wisdom_frame: {
        emotional_context: 'routine',
        sensitivity_level: 'low',
        is_consequential: false,
        consequential_reason: null,
        wellbeing_risk: false,
        affected_parties: ['user'],
        recommended_posture: 'send',
        guidance: 'no concerns',
        reflection_invitation: null,
      },
      suggested_revision: null,
    });
    expect(parsed.decision).toBe('proceed');
  });
});
