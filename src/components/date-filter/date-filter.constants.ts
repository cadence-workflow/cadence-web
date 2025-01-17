export const DATE_FORMAT = 'dd MMM yyyy, HH:mm:ss z';

export const QUICK_SELECT_OPTIONS = [
  { label: 'Last 5 minutes', durationSeconds: 5 * 60 },
  { label: 'Last 15 minutes', durationSeconds: 15 * 60 },
  { label: 'Last 1 hour', durationSeconds: 1 * 60 * 60 },
  { label: 'Last 6 hours', durationSeconds: 6 * 60 * 60 },
  { label: 'Last 12 hours', durationSeconds: 12 * 60 * 60 },
  { label: 'Last 1 day', durationSeconds: 1 * 24 * 60 * 60 },
  { label: 'Last 7 days', durationSeconds: 7 * 24 * 60 * 60 },
] as const satisfies Array<{ label: string; durationSeconds: number }>;
