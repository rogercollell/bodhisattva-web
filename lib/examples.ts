export interface Example {
  id: string;
  label: string;
  draft: string;
  recipientContext: string;
}

export const EXAMPLES: Example[] = [
  {
    id: 'angry-manager',
    label: 'Angry email to manager',
    draft:
      "Alice, the Q3 deadline is completely unreasonable. I'm beyond frustrated " +
      'with how this has been handled and I need you to understand that.',
    recipientContext: 'My manager. She set a Q3 deadline I think is unrealistic.',
  },
  {
    id: 'dinner-mom',
    label: 'Dinner invite to mom',
    draft: 'Hey mom, are you free for dinner Sunday evening? I can cook.',
    recipientContext: 'My mother.',
  },
  {
    id: 'therapist-checkin',
    label: 'Checking in with my therapist',
    draft:
      "I've been feeling really low this week and just wanted to flag it before " +
      'our session Tuesday. Can we focus on that?',
    recipientContext: 'My therapist. Routine check-in.',
  },
];
