import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import { type WorkflowExecutionStartedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionStartedEventAttributes';

export const mockDescribeWorkflowOpenResponse: DescribeWorkflowExecutionResponse =
  {
    executionConfiguration: {
      taskList: {
        name: 'mock-tasklist',
        kind: 'TASK_LIST_KIND_INVALID',
        baseName: '',
      },
      executionStartToCloseTimeout: { seconds: '86400', nanos: 0 },
      taskStartToCloseTimeout: { seconds: '10', nanos: 0 },
    },
    workflowExecutionInfo: {
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
      },
      type: { name: 'mock-workflow-type' },
      startTime: { seconds: '1717408148', nanos: 0 },
      closeTime: null,
      closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
      historyLength: '5',
      parentExecutionInfo: null,
      executionTime: { seconds: '1717408150', nanos: 0 },
      memo: null,
      searchAttributes: null,
      autoResetPoints: null,
      taskList: 'mock-tasklist',
      isCron: false,
      updateTime: { seconds: '1717408200', nanos: 0 },
      partitionConfig: {},
      taskListInfo: null,
      activeClusterSelectionPolicy: null,
      cronOverlapPolicy: 'CRON_OVERLAP_POLICY_INVALID',
      cronSchedule: '',
      executionStatus: 'WORKFLOW_EXECUTION_STATUS_INVALID',
      scheduledExecutionTime: null,
    },
    pendingActivities: [],
    pendingChildren: [],
    pendingDecision: null,
  };

export const mockDescribeWorkflowClosedResponse: DescribeWorkflowExecutionResponse =
  {
    ...mockDescribeWorkflowOpenResponse,
    workflowExecutionInfo: {
      ...mockDescribeWorkflowOpenResponse.workflowExecutionInfo!,
      closeTime: { seconds: '1717409148', nanos: 0 },
      closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      historyLength: '42',
    },
  };

// What the backend returns when the caller omits runId: it resolves the request
// to the workflow's current run, which is a different run to MOCK_RUN_ID.
export const MOCK_CURRENT_RUN_ID = 'mock-current-runid';

export const mockDescribeWorkflowClosedCurrentRunResponse: DescribeWorkflowExecutionResponse =
  {
    ...mockDescribeWorkflowClosedResponse,
    workflowExecutionInfo: {
      ...mockDescribeWorkflowClosedResponse.workflowExecutionInfo!,
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: MOCK_CURRENT_RUN_ID,
      },
    },
  };

export const MOCK_ORIGINAL_EXECUTION_RUN_ID = 'mock-original-execution-runid';

// A closed workflow whose describe data carries no execution to resolve a run
// from, forcing the close event lookup back onto the requested runId.
export const mockDescribeWorkflowClosedWithoutExecutionResponse: DescribeWorkflowExecutionResponse =
  {
    ...mockDescribeWorkflowClosedResponse,
    workflowExecutionInfo: {
      ...mockDescribeWorkflowClosedResponse.workflowExecutionInfo!,
      workflowExecution: null,
    },
  };

const startedEventAttributes: WorkflowExecutionStartedEventAttributes = {
  workflowType: { name: 'mock-workflow-type' },
  parentExecutionInfo: null,
  taskList: {
    name: 'mock-tasklist',
    kind: 'TASK_LIST_KIND_INVALID',
    baseName: '',
  },
  input: null,
  executionStartToCloseTimeout: { seconds: '86400', nanos: 0 },
  taskStartToCloseTimeout: { seconds: '10', nanos: 0 },
  continuedExecutionRunId: '',
  initiator: 'CONTINUE_AS_NEW_INITIATOR_INVALID',
  continuedFailure: null,
  lastCompletionResult: null,
  originalExecutionRunId: MOCK_ORIGINAL_EXECUTION_RUN_ID,
  identity: '',
  firstExecutionRunId: '',
  retryPolicy: null,
  attempt: 0,
  expirationTime: null,
  cronSchedule: '',
  firstDecisionTaskBackoff: null,
  memo: null,
  searchAttributes: null,
  prevAutoResetPoints: null,
  header: null,
  firstScheduledTime: null,
  partitionConfig: {},
  requestId: '',
  cronOverlapPolicy: 'CRON_OVERLAP_POLICY_INVALID',
  activeClusterSelectionPolicy: null,
};

// First page of history for a workflow whose describe data is unavailable —
// drives the archived-workflow fallback.
export const mockStartedEventHistory: GetWorkflowExecutionHistoryResponse = {
  history: {
    events: [
      {
        eventId: '1',
        eventTime: { seconds: '1717408148', nanos: 0 },
        version: '0',
        taskId: '0',
        attributes: 'workflowExecutionStartedEventAttributes',
        workflowExecutionStartedEventAttributes: startedEventAttributes,
      },
    ],
  },
  archived: true,
  rawHistory: [],
  nextPageToken: '',
};

export const mockCloseEventHistory: GetWorkflowExecutionHistoryResponse = {
  history: {
    events: [
      {
        eventId: '42',
        eventTime: { seconds: '1717409148', nanos: 0 },
        version: '0',
        taskId: '0',
        attributes: 'workflowExecutionCompletedEventAttributes',
        workflowExecutionCompletedEventAttributes: {
          result: null,
          decisionTaskCompletedEventId: '41',
        },
      },
    ],
  },
  archived: false,
  rawHistory: [],
  nextPageToken: '',
};

export const mockEmptyHistory: GetWorkflowExecutionHistoryResponse = {
  history: { events: [] },
  archived: false,
  rawHistory: [],
  nextPageToken: '',
};

export const mockNullHistory: GetWorkflowExecutionHistoryResponse = {
  history: null,
  archived: false,
  rawHistory: [],
  nextPageToken: '',
};
