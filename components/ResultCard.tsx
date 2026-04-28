'use client';

import { useState } from 'react';
import type { FramingResponse } from '@/lib/schema';
import { DecisionBadge } from './DecisionBadge';
import { RawJsonDisclosure } from './RawJsonDisclosure';
import { InstallCTA } from './InstallCTA';

export function ResultCard({ response }: { response: FramingResponse }) {
  const { decision, wisdom_frame: frame, suggested_revision } = response;
  const [copied, setCopied] = useState(false);

  if (decision === 'hold') {
    return (
      <section className="flex flex-col gap-5 rounded-lg border border-border bg-white p-6">
        <DecisionBadge decision="hold" />
        <p className="text-sm italic text-ink-soft">
          If this is real, please reach out — you matter.
        </p>
        <Field label="What the frame saw" value={frame.emotional_context} />
        <Field label="Guidance" value={frame.guidance} />
        <RawJsonDisclosure response={response} />
      </section>
    );
  }

  const why = frame.consequential_reason ?? frame.recommended_posture;

  return (
    <section className="flex flex-col gap-5 rounded-lg border border-border bg-white p-6">
      <DecisionBadge decision={decision} />
      <Field label="What the frame saw" value={frame.emotional_context} />
      <Field label="Why this read" value={why} />
      <Field label="Guidance" value={frame.guidance} />
      {decision === 'revise' && suggested_revision && (
        <div className="flex flex-col gap-2 border-l-2 border-revise/40 bg-revise-bg/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-soft">Suggested rewrite</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(suggested_revision).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                });
              }}
              className="text-xs text-ink-soft underline-offset-2 hover:text-ink hover:underline"
            >
              {copied ? 'copied' : 'copy'}
            </button>
          </div>
          <p className="whitespace-pre-wrap text-base leading-relaxed">{suggested_revision}</p>
        </div>
      )}
      <InstallCTA />
      <RawJsonDisclosure response={response} />
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-ink-soft">{label}</span>
      <p className="text-base leading-relaxed">{value}</p>
    </div>
  );
}
