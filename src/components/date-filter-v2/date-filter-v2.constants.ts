import { type RelativeDurationConfig } from './date-filter-v2.types';

export const DATE_FILTER_RELATIVE_VALUES = {
  'now-5m': { label: 'Last 5 minutes', durationSeconds: 5 * 60 },
  'now-15m': { label: 'Last 15 minutes', durationSeconds: 15 * 60 },
  'now-1h': { label: 'Last 1 hour', durationSeconds: 1 * 60 * 60 },
  'now-6h': { label: 'Last 6 hours', durationSeconds: 6 * 60 * 60 },
  'now-12h': { label: 'Last 12 hours', durationSeconds: 12 * 60 * 60 },
  'now-1d': { label: 'Last 1 day', durationSeconds: 1 * 24 * 60 * 60 },
  'now-7d': { label: 'Last 7 days', durationSeconds: 7 * 24 * 60 * 60 },
  'now-30d': { label: 'Last 30 days', durationSeconds: 30 * 24 * 60 * 60 },
} as const satisfies Record<`now-${string}`, RelativeDurationConfig>;
