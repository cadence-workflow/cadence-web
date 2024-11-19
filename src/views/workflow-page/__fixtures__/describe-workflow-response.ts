import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';

export const describeWorkflowResponse: DescribeWorkflowResponse = {
  pendingActivities: [
    {
      activityId: 'test-activity-2',
      activityType: {
        name: 'activity.test.TestActivity',
      },
      state: 'PENDING_ACTIVITY_STATE_STARTED',
      heartbeatDetails: null,
      lastHeartbeatTime: {
        seconds: '1729168753',
        nanos: 969000000,
      },
      lastStartedTime: {
        seconds: '1729168753',
        nanos: 969000000,
      },
      attempt: 0,
      maximumAttempts: 5,
      scheduledTime: null,
      expirationTime: {
        seconds: '1729169113',
        nanos: 969000000,
      },
      lastFailure: null,
      lastWorkerIdentity: 'test-worker-identity-2',
      startedWorkerIdentity: 'test-worker-identity-2',
      scheduleId: '1234',
    },
    {
      activityId: 'test-activity-1',
      activityType: {
        name: 'activity.test.TestActivity',
      },
      state: 'PENDING_ACTIVITY_STATE_STARTED',
      heartbeatDetails: null,
      lastHeartbeatTime: {
        seconds: '1729168753',
        nanos: 969000000,
      },
      lastStartedTime: {
        seconds: '1729168753',
        nanos: 969000000,
      },
      attempt: 0,
      maximumAttempts: 0,
      scheduledTime: null,
      expirationTime: null,
      lastFailure: null,
      lastWorkerIdentity: 'test-worker-identity-1',
      startedWorkerIdentity: 'test-worker-identity-1',
      scheduleId: '1234',
    },
  ],
  pendingChildren: [],
  executionConfiguration: {
    taskList: {
      name: 'test-task-queue',
      kind: 'TASK_LIST_KIND_INVALID',
    },
    executionStartToCloseTimeout: {
      seconds: '360',
      nanos: 0,
    },
    taskStartToCloseTimeout: {
      seconds: '10',
      nanos: 0,
    },
  },
  workflowExecutionInfo: {
    partitionConfig: {
      'isolation-group': 'test-group',
    },
    workflowExecution: {
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
    },
    type: {
      name: 'workflow.test.base',
    },
    startTime: {
      seconds: '1729168753',
      nanos: 919000000,
    },
    closeTime: {
      seconds: '1729168756',
      nanos: 76020275,
    },
    closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED',
    historyLength: '31',
    parentExecutionInfo: {
      domainId: 'test-domain-id',
      domainName: 'test-domain-name',
      workflowExecution: {
        workflowId: 'test-parent-workflow-id',
        runId: 'test-parent-run-id',
      },
      initiatedId: '7',
    },
    executionTime: {
      seconds: '1729168753',
      nanos: 919000000,
    },
    memo: {
      fields: {},
    },
    searchAttributes: {
      indexedFields: {
        BinaryChecksums: {
          data: 'test-binary-checksum',
        },
        CadenceChangeVersion: {
          data: 'test-change-version',
        },
      },
    },
    autoResetPoints: {
      points: [
        {
          binaryChecksum: 'test-binary-checksum',
          runId: 'test-run-id',
          firstDecisionCompletedId: '4',
          createdTime: {
            seconds: '1729168753',
            nanos: 968806515,
          },
          expiringTime: null,
          resettable: true,
        },
      ],
    },
    taskList: '',
    isCron: false,
    updateTime: null,
    closeEvent: {
      eventId: '31',
      eventTime: {
        seconds: '1729168756',
        nanos: 76020275,
      },
      version: 'test-version',
      taskId: 'test-task-id',
      workflowExecutionTerminatedEventAttributes: {
        reason: 'test-reason',
        details: null,
        identity: 'test-identity',
      },
      attributes: 'workflowExecutionTerminatedEventAttributes',
    },
    isArchived: false,
  },
  pendingDecision: null,
};
