import type { FramingResponse } from '@/lib/schema';

export function RawJsonDisclosure({ response }: { response: FramingResponse }) {
  return (
    <details className="mt-6 rounded-md border border-border bg-white/50 px-4 py-3 text-sm">
      <summary className="cursor-pointer text-ink-soft">Show raw response</summary>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs text-ink-soft">
        {JSON.stringify(response, null, 2)}
      </pre>
    </details>
  );
}
