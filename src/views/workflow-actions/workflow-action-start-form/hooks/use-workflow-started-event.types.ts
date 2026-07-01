import { type FormattedHistoryEventForType } from '@/utils/data-formatters/schema/format-history-event-schema';

export type UseWorkflowStartedEventParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
};

export type WorkflowStartedEvent =
  FormattedHistoryEventForType<'WorkflowExecutionStarted'>;
