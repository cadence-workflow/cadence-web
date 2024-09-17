import type { ChildWorkflowExecutionHistoryEvent } from '../workflow-history.types';

export const initiateChildWorkflowEvent = {
  eventId: '40',
  eventTime: {
    seconds: '172579671',
    nanos: 830123299,
  },
  version: '575102',
  taskId: '5877269782',
  startChildWorkflowExecutionInitiatedEventAttributes: {
    domain: 'cadence-domain',
    workflowId: 'workflow.cancellation-workflow.cancellation.external-child',
    workflowType: {
      name: 'workflow.cancellation.external',
    },
    taskList: {
      name: 'canary-task-queue',
      kind: 'TASK_LIST_KIND_INVALID',
    },
    input: {
      data: 'MTcyNjQ5Mjc1MTc5ODgxMjMwOAozMDAwMDAwMDAwMAo=',
    },
    executionStartToCloseTimeout: {
      seconds: '360',
      nanos: 0,
    },
    taskStartToCloseTimeout: {
      seconds: '10',
      nanos: 0,
    },
    parentClosePolicy: 'PARENT_CLOSE_POLICY_ABANDON',
    control: '',
    decisionTaskCompletedEventId: '4',
    workflowIdReusePolicy: 'WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE',
    retryPolicy: null,
    cronSchedule: '',
    memo: null,
    searchAttributes: null,
    delayStart: null,
    jitterStart: null,
    firstRunAt: null,
    header: {
      fields: {},
    },
  },
  attributes: 'startChildWorkflowExecutionInitiatedEventAttributes',
} as const satisfies ChildWorkflowExecutionHistoryEvent;

export const initiateFailureChildWorkflowEvent = {
  eventId: '41',
  eventTime: {
    seconds: '1725769672',
    nanos: 830123299,
  },
  version: '575102',
  taskId: '5877269783',
  startChildWorkflowExecutionFailedEventAttributes: {
    domain: 'cadence-domain',
    workflowId: 'workflow.cancellation-workflow.cancellation.external-child',
    workflowType: {
      name: 'workflow.cancellation.external',
    },
    control: '',
    decisionTaskCompletedEventId: '4',
    cause: 'CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_INVALID',
    initiatedEventId: '',
  },
  attributes: 'startChildWorkflowExecutionFailedEventAttributes',
} as const satisfies ChildWorkflowExecutionHistoryEvent;

export const startChildWorkflowEvent = {
  eventId: '42',
  eventTime: {
    seconds: '1725769673',
    nanos: 862443565,
  },
  version: '575102',
  taskId: '5877269784',
  childWorkflowExecutionStartedEventAttributes: {
    domain: 'cadence-domain',
    workflowExecution: {
      workflowId: 'workflow.cancellation-workflow.cancellation.external-child',
      runId: '107495f0-ab19-4631-b6b9-dca2c2a30482',
    },
    workflowType: {
      name: 'workflow.cancellation.external',
    },
    initiatedEventId: '40',
    header: {
      fields: {},
    },
  },
  attributes: 'childWorkflowExecutionStartedEventAttributes',
} as const satisfies ChildWorkflowExecutionHistoryEvent;

export const completeChildWorkflowEvent = {
  eventId: '43',
  eventTime: {
    seconds: '1725769674',
    nanos: 218146161,
  },
  version: '575102',
  taskId: '5877269785',
  childWorkflowExecutionCompletedEventAttributes: {
    domain: 'cadence-domain',
    workflowExecution: {
      workflowId: 'workflow.cancellation-workflow.cancellation.external-child',
      runId: '107495f0-ab19-4631-b6b9-dca2c2a30482',
    },
    workflowType: {
      name: 'workflow.cancellation.external',
    },
    initiatedEventId: '9',
    startedEventId: '41',
    result: null,
  },
  attributes: 'childWorkflowExecutionCompletedEventAttributes',
} as const satisfies ChildWorkflowExecutionHistoryEvent;

export const cancelChildWorkflowEvent = {
  eventId: '44',
  eventTime: {
    seconds: '1725769675',
    nanos: 993971123,
  },
  version: '575102',
  taskId: '5877269786',
  childWorkflowExecutionCanceledEventAttributes: {
    domain: 'cadence-domain',
    workflowExecution: {
      workflowId: 'workflow.cancellation-workflow.cancellation.external-child',
      runId: '107495f0-ab19-4631-b6b9-dca2c2a30482',
    },
    workflowType: {
      name: 'workflow.cancellation.external',
    },
    initiatedEventId: '40',
    startedEventId: '42',
    details: {
      data: 'Y2FuY2VsZWQgYmVmb3JlIHN0YXJ0aW5nIG90aGVyIHdvcmtmbG93OiBDYW5jZWxlZEVycm9y',
    },
  },
  attributes: 'childWorkflowExecutionCanceledEventAttributes',
} as const satisfies ChildWorkflowExecutionHistoryEvent;

export const terminateChildWorkflowEvent = {
  eventId: '45',
  eventTime: {
    seconds: '1725769676',
    nanos: 993971123,
  },
  version: '575102',
  taskId: '5877269787',
  childWorkflowExecutionTerminatedEventAttributes: {
    domain: 'cadence-domain',
    workflowExecution: {
      workflowId: 'workflow.cancellation-workflow.cancellation.external-child',
      runId: '107495f0-ab19-4631-b6b9-dca2c2a30482',
    },
    workflowType: {
      name: 'workflow.cancellation.external',
    },
    initiatedEventId: '40',
    startedEventId: '42',
  },
  attributes: 'childWorkflowExecutionTerminatedEventAttributes',
} as const satisfies ChildWorkflowExecutionHistoryEvent;

export const timeoutChildWorkflowEvent = {
  eventId: '46',
  eventTime: {
    seconds: '1725769677',
    nanos: 993971123,
  },
  version: '575102',
  taskId: '5877269788',
  childWorkflowExecutionTimedOutEventAttributes: {
    domain: 'cadence-domain',
    workflowExecution: {
      workflowId: 'workflow.cancellation-workflow.cancellation.external-child',
      runId: '107495f0-ab19-4631-b6b9-dca2c2a30482',
    },
    workflowType: {
      name: 'workflow.cancellation.external',
    },
    initiatedEventId: '40',
    startedEventId: '42',
    timeoutType: 'TIMEOUT_TYPE_HEARTBEAT',
  },
  attributes: 'childWorkflowExecutionTimedOutEventAttributes',
} as const satisfies ChildWorkflowExecutionHistoryEvent;

export const failChildWorkflowEvent = {
  eventId: '47',
  eventTime: {
    seconds: '1725769678',
    nanos: 993971123,
  },
  version: '575102',
  taskId: '5877269789',
  childWorkflowExecutionFailedEventAttributes: {
    domain: 'cadence-domain',
    workflowExecution: {
      workflowId: 'workflow.cancellation-workflow.cancellation.external-child',
      runId: '107495f0-ab19-4631-b6b9-dca2c2a30482',
    },
    workflowType: {
      name: 'workflow.cancellation.external',
    },
    initiatedEventId: '40',
    startedEventId: '42',
    failure: {
      details: '',
      reason: '',
    },
  },
  attributes: 'childWorkflowExecutionFailedEventAttributes',
} as const satisfies ChildWorkflowExecutionHistoryEvent;

export const completedChildWorkflowEvents: ChildWorkflowExecutionHistoryEvent[] =
  [
    initiateChildWorkflowEvent,
    startChildWorkflowEvent,
    completeChildWorkflowEvent,
  ];

export const failedChildWorkflowEvents: ChildWorkflowExecutionHistoryEvent[] = [
  initiateChildWorkflowEvent,
  startChildWorkflowEvent,
  failChildWorkflowEvent,
];

export const timedoutChildWorkflowEvents: ChildWorkflowExecutionHistoryEvent[] =
  [
    initiateChildWorkflowEvent,
    startChildWorkflowEvent,
    timeoutChildWorkflowEvent,
  ];

export const terminatedChildWorkflowEvents: ChildWorkflowExecutionHistoryEvent[] =
  [
    initiateChildWorkflowEvent,
    startChildWorkflowEvent,
    terminateChildWorkflowEvent,
  ];

export const canceledChildWorkflowEvents: ChildWorkflowExecutionHistoryEvent[] =
  [
    initiateChildWorkflowEvent,
    startChildWorkflowEvent,
    cancelChildWorkflowEvent,
  ];

export const initationFailedChildWorkflowEvents: ChildWorkflowExecutionHistoryEvent[] =
  [initiateChildWorkflowEvent, initiateFailureChildWorkflowEvent];
