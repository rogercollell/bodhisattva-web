// SOURCE: bodhisattva-mcp/src/bodhisattva_mcp/gate.py (Decision, decide, _build_revision)
// See lib/prompts.ts for last-synced commit; bump in tandem.

import { generateText, Output } from 'ai';

import { WisdomFrameSchema, type FramingResponse, type WisdomFrame } from '@/lib/schema';
import { buildEmailFramePrompt, buildRevisionPrompt } from '@/lib/prompts';
import { fallbackFrame } from '@/lib/fallback';

const MODEL = 'anthropic/claude-haiku-4.5';

export interface RunFramingInput {
  draft: string;
  recipientContext: string;
}

export type Decision = 'proceed' | 'revise' | 'hold';

export interface DecisionOutcome {
  decision: Decision;
  reason?: string;
  shouldReviseDraft: boolean;
}

export function decide(frame: WisdomFrame): DecisionOutcome {
  if (frame.sensitivity_level === 'critical' || frame.wellbeing_risk) {
    return { decision: 'hold', reason: frame.guidance, shouldReviseDraft: false };
  }
  if (frame.is_consequential) {
    return { decision: 'revise', shouldReviseDraft: true };
  }
  return { decision: 'proceed', shouldReviseDraft: false };
}

async function runWisdomFrame(input: RunFramingInput): Promise<WisdomFrame> {
  const prompt = buildEmailFramePrompt({
    domain: 'general',
    recipient: 'recipient@example.com',
    recipientContext: input.recipientContext,
    subject: '',
    draft: input.draft,
  });
  try {
    const { output } = await generateText({
      model: MODEL,
      prompt,
      output: Output.object({ schema: WisdomFrameSchema }),
      temperature: 0,
    });
    return output;
  } catch {
    return fallbackFrame(input.draft);
  }
}

async function runRevision(frame: WisdomFrame, draft: string): Promise<string | null> {
  const prompt = buildRevisionPrompt({
    emotional_context: frame.emotional_context,
    recommended_posture: frame.recommended_posture,
    guidance: frame.guidance,
    draft,
  });
  try {
    const { text } = await generateText({
      model: MODEL,
      prompt,
      temperature: 0,
    });
    const trimmed = text.trim();
    return trimmed || null;
  } catch {
    return null;
  }
}

export async function runFraming(input: RunFramingInput): Promise<FramingResponse> {
  const frame = await runWisdomFrame(input);
  const outcome = decide(frame);

  if (!outcome.shouldReviseDraft) {
    return { decision: outcome.decision, wisdom_frame: frame, suggested_revision: null };
  }

  const revision = await runRevision(frame, input.draft);
  if (revision === null) {
    return { decision: 'hold', wisdom_frame: frame, suggested_revision: null };
  }
  return { decision: 'revise', wisdom_frame: frame, suggested_revision: revision };
}
