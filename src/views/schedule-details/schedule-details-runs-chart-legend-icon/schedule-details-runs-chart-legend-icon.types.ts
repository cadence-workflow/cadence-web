import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export type ChartLegendVariant = WorkflowStatus | 'skipped' | 'next';

export type Props = {
  variant: ChartLegendVariant;
  size: number;
};
