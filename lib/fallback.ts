// SOURCE: bodhisattva-mcp/src/bodhisattva_mcp/attune/wisdom_frame.py (_fallback_frame, _WELLBEING_RISK_RE)
// See lib/prompts.ts for last-synced commit; bump in tandem.

import { CRISIS_RESOURCE_TEXT } from '@/lib/prompts';
import type { WisdomFrame } from '@/lib/schema';

export const WELLBEING_RISK_RE =
  /\b(suicid(?:e|al)|kill myself|end it|end my life|can't go on|cannot go on|hurt myself|harm myself|self[- ]harm|panic attack|not safe|unsafe|hurt someone|harm someone)\b/i;

export function fallbackFrame(userMessage: string): WisdomFrame {
  if (WELLBEING_RISK_RE.test(userMessage)) {
    return {
      emotional_context: 'The user may be in acute distress or unsafe.',
      sensitivity_level: 'critical',
      is_consequential: false,
      consequential_reason: null,
      wellbeing_risk: true,
      affected_parties: ['user'],
      recommended_posture: 'Lead with attunement and a direct safety check.',
      guidance:
        'Acknowledge the distress directly, keep the response simple, ' +
        'and encourage immediate human support. ' +
        CRISIS_RESOURCE_TEXT,
      reflection_invitation: null,
    };
  }

  return {
    emotional_context: 'The turn may carry interpersonal or emotional stakes.',
    sensitivity_level: 'medium',
    is_consequential: true,
    consequential_reason: 'The user may be asking for help with a consequential action.',
    wellbeing_risk: false,
    affected_parties: ['user', 'other people'],
    recommended_posture: 'Be steady, transparent, and non-judgmental.',
    guidance:
      'Acknowledge the stakes before offering help. ' +
      "If you proceed, preserve the user's agency and avoid amplifying heat or urgency.",
    reflection_invitation:
      'I notice this could have real consequences. ' +
      'Do you want to pause for a beat and shape it carefully before we proceed?',
  };
}
