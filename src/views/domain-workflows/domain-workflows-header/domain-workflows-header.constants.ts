import { type WorkflowCronValue } from './domain-workflows-header.types';

export const WORKFLOW_CRON_LABELS = {
  CRON: 'Cron workflows only',
  NON_CRON: 'Non-cron workflows only',
} as const satisfies Record<WorkflowCronValue, string>;
