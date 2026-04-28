'use client';

import { useId } from 'react';

interface Props {
  draft: string;
  recipientContext: string;
  onDraftChange: (v: string) => void;
  onContextChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function DraftForm({
  draft,
  recipientContext,
  onDraftChange,
  onContextChange,
  onSubmit,
  loading,
}: Props) {
  const draftId = useId();
  const contextId = useId();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={draftId} className="text-sm font-medium text-ink-soft">
          Draft
        </label>
        <textarea
          id={draftId}
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          rows={8}
          required
          className="rounded-md border border-border bg-white p-3 text-base leading-relaxed focus:border-ink/40 focus:outline-none"
          placeholder="Paste the email draft your AI agent is about to send..."
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={contextId} className="text-sm font-medium text-ink-soft">
          Recipient context (optional)
        </label>
        <textarea
          id={contextId}
          value={recipientContext}
          onChange={(e) => onContextChange(e.target.value)}
          rows={2}
          className="rounded-md border border-border bg-white p-3 text-base leading-relaxed focus:border-ink/40 focus:outline-none"
          placeholder="e.g., my manager who set this Q3 deadline"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !draft.trim()}
        className="self-start rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-ink/90 disabled:opacity-40"
      >
        {loading ? 'Reading the draft…' : 'See the framing'}
      </button>
    </form>
  );
}
