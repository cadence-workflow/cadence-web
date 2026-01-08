import { type WorkflowExecutionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionInfo';

export const mockWorkflowExecutions: Array<WorkflowExecutionInfo> = [
  {
    workflowExecution: {
      workflowId: 'mock-wf-uuid-1',
      runId: 'mock-run-uuid-1',
    },
    type: { name: 'mock-workflow-name' },
    startTime: { seconds: '1717408148', nanos: 258000000 },
    closeTime: { seconds: '1717409148', nanos: 258000000 },
    closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    historyLength: '100',
    parentExecutionInfo: null,
    executionTime: null,
    memo: null,
    searchAttributes: null,
    autoResetPoints: null,
    taskList: '',
    isCron: false,
    updateTime: null,
    partitionConfig: {},
    taskListInfo: null,
    activeClusterSelectionPolicy: null,
    cronOverlapPolicy: 'CRON_OVERLAP_POLICY_INVALID',
  },
];
