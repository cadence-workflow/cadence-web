import { type DescribeWorkflowExecutionResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeWorkflowExecutionResponse';
import { type GetWorkflowExecutionHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/GetWorkflowExecutionHistoryResponse';
import { type WorkflowExecutionStartedEventAttributes } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionStartedEventAttributes';

export const mockDescribeBatchOperationWorkflowRunning: DescribeWorkflowExecutionResponse =
  {
    executionConfiguration: {
      taskList: {
        name: 'cadence-sys-batcher-tasklist',
        kind: 'TASK_LIST_KIND_INVALID',
        baseName: '',
      },
      executionStartToCloseTimeout: {
        seconds: String(20 * 365 * 24 * 60 * 60), //mirrored from backend
        nanos: 0,
      },
      taskStartToCloseTimeout: { seconds: '10', nanos: 0 },
    },
    workflowExecutionInfo: {
      workflowExecution: {
        workflowId: 'mock-batch-action-id-1',
        runId: 'mock-batch-action-run-id-1',
      },
      type: { name: 'cadence-sys-batch-workflow-v2' },
      startTime: { seconds: '1717408148', nanos: 258000000 },
      closeTime: null,
      closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
      historyLength: '5',
      parentExecutionInfo: null,
      executionTime: { seconds: '1717408150', nanos: 0 },
      memo: null,
      searchAttributes: null,
      autoResetPoints: null,
      taskList: 'cadence-sys-batcher-tasklist',
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

export const mockDescribeBatchOperationWorkflowCompleted: DescribeWorkflowExecutionResponse =
  {
    ...mockDescribeBatchOperationWorkflowRunning,
    workflowExecutionInfo: {
      ...mockDescribeBatchOperationWorkflowRunning.workflowExecutionInfo!,
      closeTime: { seconds: '1717409148', nanos: 258000000 },
      closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      historyLength: '100',
    },
  };

export const mockDescribeBatchOperationWorkflowTerminated: DescribeWorkflowExecutionResponse =
  {
    ...mockDescribeBatchOperationWorkflowRunning,
    workflowExecutionInfo: {
      ...mockDescribeBatchOperationWorkflowRunning.workflowExecutionInfo!,
      closeTime: { seconds: '1717409148', nanos: 0 },
      closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
      historyLength: '42',
    },
  };

export const mockDescribeBatchOperationWorkflowFailed: DescribeWorkflowExecutionResponse =
  {
    ...mockDescribeBatchOperationWorkflowRunning,
    workflowExecutionInfo: {
      ...mockDescribeBatchOperationWorkflowRunning.workflowExecutionInfo!,
      closeTime: { seconds: '1717409148', nanos: 0 },
      closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT',
      historyLength: '8',
    },
  };

const encodedBatcherInput = (params: Record<string, unknown>) =>
  Buffer.from(JSON.stringify(params)).toString('base64');

const baseStartedEventAttributes: WorkflowExecutionStartedEventAttributes = {
  workflowType: { name: 'cadence-sys-batch-workflow-v2' },
  parentExecutionInfo: null,
  taskList: {
    name: 'cadence-sys-batcher-tasklist',
    kind: 'TASK_LIST_KIND_INVALID',
    baseName: '',
  },
  input: null,
  executionStartToCloseTimeout: null,
  taskStartToCloseTimeout: null,
  continuedExecutionRunId: '',
  initiator: 'CONTINUE_AS_NEW_INITIATOR_INVALID',
  continuedFailure: null,
  lastCompletionResult: null,
  originalExecutionRunId: '',
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

const buildHistoryResponse = (
  params: Record<string, unknown>
): GetWorkflowExecutionHistoryResponse => ({
  history: {
    events: [
      {
        eventId: '1',
        eventTime: { seconds: '1717408148', nanos: 0 },
        version: '0',
        taskId: '0',
        attributes: 'workflowExecutionStartedEventAttributes',
        workflowExecutionStartedEventAttributes: {
          ...baseStartedEventAttributes,
          input: { data: encodedBatcherInput(params) },
        },
      },
    ],
  },
  archived: false,
  rawHistory: [],
  nextPageToken: '',
});

export const mockBatcherStartedHistory = buildHistoryResponse({
  DomainName: 'mock-domain',
  Query: 'WorkflowType="foo"',
  Reason: 'cleanup',
  BatchType: 'terminate',
  RPS: 100,
});

export const mockBatcherStartedHistoryWithUnknownType = buildHistoryResponse({
  DomainName: 'mock-domain',
  BatchType: 'replicate', // not a UI-supported type — fails the input parse
  RPS: 50,
});

// Mirrors the batcher's HeartBeatDetails struct (Go field names) used for progress.
export const MOCK_BATCH_PROGRESS = {
  TotalEstimate: 200,
  SuccessCount: 120,
  ErrorCount: 5,
};

// Running batch whose pending batcher activity is reporting progress via heartbeat.
export const mockDescribeBatchOperationWorkflowRunningWithProgress: DescribeWorkflowExecutionResponse =
  {
    ...mockDescribeBatchOperationWorkflowRunning,
    pendingActivities: [
      {
        activityId: '0',
        activityType: { name: 'cadence-sys-batch-activity-v2' },
        state: 'PENDING_ACTIVITY_STATE_STARTED',
        heartbeatDetails: { data: encodedBatcherInput(MOCK_BATCH_PROGRESS) },
        lastHeartbeatTime: { seconds: '1717408200', nanos: 0 },
        lastStartedTime: { seconds: '1717408150', nanos: 0 },
        attempt: 1,
        maximumAttempts: 0,
        scheduledTime: { seconds: '1717408149', nanos: 0 },
        expirationTime: null,
        lastFailure: null,
        lastWorkerIdentity: 'mock-worker',
        startedWorkerIdentity: 'mock-worker',
        scheduleId: '0',
      },
    ],
  };

// Failed batch that timed out at the workflow level while the batcher activity
// was still pending — its last heartbeat survives on the describe response.
export const mockDescribeBatchOperationWorkflowFailedWithPendingProgress: DescribeWorkflowExecutionResponse =
  {
    ...mockDescribeBatchOperationWorkflowFailed,
    pendingActivities:
      mockDescribeBatchOperationWorkflowRunningWithProgress.pendingActivities,
  };

// Close-event history carrying the workflow's final HeartBeatDetails result.
export const mockBatcherCloseEventHistory: GetWorkflowExecutionHistoryResponse =
  {
    history: {
      events: [
        {
          eventId: '100',
          eventTime: { seconds: '1717409148', nanos: 0 },
          version: '0',
          taskId: '0',
          attributes: 'workflowExecutionCompletedEventAttributes',
          workflowExecutionCompletedEventAttributes: {
            result: { data: encodedBatcherInput(MOCK_BATCH_PROGRESS) },
            decisionTaskCompletedEventId: '99',
          },
        },
      ],
    },
    archived: false,
    rawHistory: [],
    nextPageToken: '',
  };
