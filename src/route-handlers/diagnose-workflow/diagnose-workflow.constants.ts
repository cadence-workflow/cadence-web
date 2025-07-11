import { type Options as RetryOptions } from 'p-retry';

export const DIAGNOSTICS_WORKFLOW_DOMAIN = 'cadence-system';
export const DIAGNOSTICS_WORKFLOW_QUERY = 'query-diagnostics-report';

export const DIAGNOSTICS_NOT_COMPLETED_MSG =
  'workflow diagnosis still in progress.';

export const DIAGNOSTICS_QUERY_RETRY_POLICY = {
  minTimeout: 1000,
  maxTimeout: 10000,
  maxRetryTime: 60000,
  factor: 2,
} as const satisfies Partial<RetryOptions>;
