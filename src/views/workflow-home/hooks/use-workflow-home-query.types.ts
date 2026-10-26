import { type WorkflowPageTabContentParams } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

export type UseWorkflowHomeQueryParams = Pick<
  WorkflowPageTabContentParams,
  'domain' | 'cluster' | 'workflowId' | 'runId'
>;

export type UseWorkflowHomeQueryOptions = {
  enabled: boolean;
  refetchInterval?: number | false;
};
