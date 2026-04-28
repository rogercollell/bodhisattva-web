import type { Decision } from '@/lib/frame';

const STYLES: Record<Decision, { label: string; classes: string }> = {
  proceed: {
    label: 'PROCEED',
    classes: 'bg-proceed-bg text-proceed border-proceed/20',
  },
  revise: {
    label: 'REVISE',
    classes: 'bg-revise-bg text-revise border-revise/20',
  },
  hold: {
    label: 'HOLD',
    classes: 'bg-hold-bg text-hold border-hold/20',
  },
};

export function DecisionBadge({ decision }: { decision: Decision }) {
  const s = STYLES[decision];
  return (
    <div
      className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-semibold tracking-widest ${s.classes}`}
    >
      {s.label}
    </div>
  );
}
