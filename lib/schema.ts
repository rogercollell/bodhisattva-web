import { z } from 'zod';

export const WisdomFrameSchema = z.object({
  emotional_context: z.string(),
  sensitivity_level: z.enum(['low', 'medium', 'high', 'critical']),
  is_consequential: z.boolean(),
  consequential_reason: z.string().nullable(),
  wellbeing_risk: z.boolean(),
  affected_parties: z.array(z.string()),
  recommended_posture: z.string(),
  guidance: z.string(),
  reflection_invitation: z.string().nullable(),
});

export type WisdomFrame = z.infer<typeof WisdomFrameSchema>;

export const FramingResponseSchema = z.object({
  decision: z.enum(['proceed', 'revise', 'hold']),
  wisdom_frame: WisdomFrameSchema,
  suggested_revision: z.string().nullable(),
});

export type FramingResponse = z.infer<typeof FramingResponseSchema>;
