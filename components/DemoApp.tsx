'use client';

import { useState } from 'react';
import type { FramingResponse } from '@/lib/schema';
import type { Example } from '@/lib/examples';
import { ExampleChips } from './ExampleChips';
import { DraftForm } from './DraftForm';
import { ResultCard } from './ResultCard';

type ErrorState =
  | { kind: 'rate_limit'; message: string }
  | { kind: 'generic' }
  | null;

export function DemoApp() {
  const [draft, setDraft] = useState('');
  const [recipientContext, setRecipientContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<FramingResponse | null>(null);
  const [error, setError] = useState<ErrorState>(null);

  const handleSelect = (ex: Example) => {
    setDraft(ex.draft);
    setRecipientContext(ex.recipientContext);
    setResponse(null);
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);
    try {
      const res = await fetch('/api/try', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ draft, recipient_context: recipientContext }),
      });
      if (res.status === 429) {
        const body = await res.json();
        setError({ kind: 'rate_limit', message: body.message ?? '' });
        return;
      }
      if (!res.ok) {
        setError({ kind: 'generic' });
        return;
      }
      const json = (await res.json()) as FramingResponse;
      setResponse(json);
    } catch {
      setError({ kind: 'generic' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ExampleChips onSelect={handleSelect} disabled={loading} />
      <DraftForm
        draft={draft}
        recipientContext={recipientContext}
        onDraftChange={setDraft}
        onContextChange={setRecipientContext}
        onSubmit={handleSubmit}
        loading={loading}
      />
      {error?.kind === 'rate_limit' && (
        <p className="rounded-md border border-border bg-white p-4 text-sm text-ink-soft">
          {error.message}
        </p>
      )}
      {error?.kind === 'generic' && (
        <p className="rounded-md border border-border bg-white p-4 text-sm text-ink-soft">
          The frame couldn&apos;t read this draft — please try again, or install locally
          for a full experience.
        </p>
      )}
      {response && <ResultCard response={response} />}
    </div>
  );
}
