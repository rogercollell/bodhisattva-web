'use client';

import { EXAMPLES, type Example } from '@/lib/examples';

interface Props {
  onSelect: (example: Example) => void;
  disabled?: boolean;
}

export function ExampleChips({ onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {EXAMPLES.map((ex) => (
        <button
          key={ex.id}
          type="button"
          onClick={() => onSelect(ex)}
          disabled={disabled}
          className="rounded-full border border-border bg-white px-3 py-1.5 text-sm text-ink-soft transition hover:border-ink/40 hover:text-ink disabled:opacity-50"
        >
          {ex.label}
        </button>
      ))}
    </div>
  );
}
