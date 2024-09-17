import type { SingleHistoryEvent } from '../workflow-history.types';

//TODO: get more realistic time and workflow id/ run id references that relates to other events

export const startWorkflowExecutionEvent = {
  eventId: '1',
  eventTime: {
    seconds: '1724747315',
    nanos: 549377718,
  },
  version: '575102',
  taskId: '22647173800',
  workflowExecutionStartedEventAttributes: {
    partitionConfig: {},
    workflowType: {
      name: 'workflow.cron',
    },
    parentExecutionInfo: null,
    taskList: {
      name: 'cadence-tasklist',
      kind: 'TASK_LIST_KIND_INVALID',
    },
    input: {
      data: 'InN0cmluZyB2YWx1ZSIsCiJ0b2tlbiIs',
    },
    executionStartToCloseTimeout: {
      seconds: '1080',
      nanos: 0,
    },
    taskStartToCloseTimeout: {
      seconds: '10',
      nanos: 0,
    },
    continuedExecutionRunId: 'e8565005-a234-4077-a917-6e5992ccbe4a',
    initiator: 'CONTINUE_AS_NEW_INITIATOR_CRON_SCHEDULE',
    continuedFailure: null,
    lastCompletionResult: null,
    originalExecutionRunId: '9c42ffa3-c9b1-430d-a993-b84fdce8c9f2',
    identity: '',
    firstExecutionRunId: '1d0e29d3-9c20-4eda-aeca-daed7f0ccb2e',
    retryPolicy: null,
    attempt: 0,
    expirationTime: null,
    cronSchedule: '@every 1m',
    firstDecisionTaskBackoff: {
      seconds: '55',
      nanos: 0,
    },
    memo: null,
    searchAttributes: null,
    prevAutoResetPoints: {
      points: [],
    },
    header: {
      fields: {},
    },
    firstScheduledTime: {
      seconds: '1716246362',
      nanos: 895425298,
    },
    requestId: '8b2d2b6f-996a-431e-96b3-17d19cf0e508',
  },
  attributes: 'workflowExecutionStartedEventAttributes',
} as const satisfies SingleHistoryEvent;

export const signalWorkflowExecutionEvent = {
  eventId: '2',
  eventTime: {
    seconds: '1724747415',
    nanos: 549377718,
  },
  version: '575102',
  taskId: '22647173801',
  workflowExecutionSignaledEventAttributes: {
    signalName: 'signal-name',
    input: {
      data: 'ImNhZGVuY2Uuc2lnbmFsIg==',
    },
    identity: 'cadence-service',
    requestId: '488cd24f-37b0-48f7-955a-c5c8c7653290',
  },
  attributes: 'workflowExecutionSignaledEventAttributes',
} as const satisfies SingleHistoryEvent;

export const recordMarkerExecutionEvent = {
  eventId: '3',
  eventTime: {
    seconds: '1724747515',
    nanos: 549377718,
  },
  version: '575102',
  taskId: '22647173802',
  markerRecordedEventAttributes: {
    markerName: 'Version',
    details: {
      data: 'ImluaXRpYWwgdmVyc2lvbiIKMwo=',
    },
    decisionTaskCompletedEventId: '4',
    header: null,
  },
  attributes: 'markerRecordedEventAttributes',
} as const satisfies SingleHistoryEvent;

export const failWorkflowExecutionEvent = {
  eventId: '48',
  eventTime: {
    seconds: '1726747515',
    nanos: 549377718,
  },
  version: '575102',
  taskId: '22647173803',
  workflowExecutionFailedEventAttributes: {
    failure: {
      reason: 'cadenceInternal:Generic',
      details:
        'bmV3IGV4ZWN1dGlvbiB0cmlnZ2VyZWQgYnkgcmVzZXQgaXMgbm90IGNvbXBsZXRlZA==',
    },
    decisionTaskCompletedEventId: '4',
  },
  attributes: 'workflowExecutionFailedEventAttributes',
} as const satisfies SingleHistoryEvent;

export const terminateWorkflowExecutionEvent = {
  eventId: '49',
  eventTime: {
    seconds: '1726747615',
    nanos: 549377718,
  },
  version: '587402',
  taskId: '6051339957',
  workflowExecutionTerminatedEventAttributes: {
    reason: 'reset domain',
    details: null,
    identity: 'history-service',
  },
  attributes: 'workflowExecutionTerminatedEventAttributes',
} as const satisfies SingleHistoryEvent;

export const timeoutWorkflowExecutionEvent = {
  eventId: '50',
  eventTime: {
    seconds: '1726747715',
    nanos: 549377718,
  },
  version: '587402',
  taskId: '6051339957',
  workflowExecutionTimedOutEventAttributes: {
    timeoutType: 'TIMEOUT_TYPE_START_TO_CLOSE',
  },
  attributes: 'workflowExecutionTimedOutEventAttributes',
} as const satisfies SingleHistoryEvent;

export const completeWorkflowExecutionEvent = {
  eventId: '51',
  eventTime: {
    seconds: '1726747715',
    nanos: 549377718,
  },
  version: '587402',
  taskId: '605133998',
  workflowExecutionCompletedEventAttributes: {
    result: null,
    decisionTaskCompletedEventId: '4',
  },
  attributes: 'workflowExecutionCompletedEventAttributes',
} as const satisfies SingleHistoryEvent;

export const cancelRequestActivityTaskEvent = {
  eventId: '52',
  eventTime: {
    seconds: '1726747715',
    nanos: 549377718,
  },
  version: '587402',
  taskId: '605133998',
  activityTaskCancelRequestedEventAttributes: {
    activityId: '0',
    decisionTaskCompletedEventId: '4',
  },
  attributes: 'activityTaskCancelRequestedEventAttributes',
} as const satisfies SingleHistoryEvent;

export const failCancelTimerEvent = {
  eventId: '53',
  eventTime: {
    seconds: '1725748670',
    nanos: 860748144,
  },
  version: '587402',
  taskId: '12690929028',
  cancelTimerFailedEventAttributes: {
    cause: '',
    timerId: '0',
    decisionTaskCompletedEventId: '9',
    identity: '67b17b8c-fc30-4c5c-ac7e-bc3046311b18',
  },
  attributes: 'cancelTimerFailedEventAttributes',
} as const satisfies SingleHistoryEvent;

export const failCancelRequestActivityTaskEvent = {
  eventId: '54',
  eventTime: {
    seconds: '1725747370',
    nanos: 599547391,
  },
  version: '587402',
  taskId: '22647174807',
  requestCancelActivityTaskFailedEventAttributes: {
    activityId: '0',
    decisionTaskCompletedEventId: '4',
    cause: '',
  },
  attributes: 'requestCancelActivityTaskFailedEventAttributes',
} as const satisfies SingleHistoryEvent;

export const continueAsNewWorkflowExecutionEvent = {
  eventId: '55',
  eventTime: {
    seconds: '1725747375',
    nanos: 636983242,
  },
  version: '587402',
  taskId: '22647174866',
  workflowExecutionContinuedAsNewEventAttributes: {
    newExecutionRunId: '8f27807a-9125-4833-b8f1-d52a4c59be9a',
    workflowType: {
      name: 'workflow.cron',
    },
    taskList: {
      name: 'cadence-task-queue',
      kind: 'TASK_LIST_KIND_INVALID',
    },
    input: {
      data: 'InN0cmluZyB2YWx1ZSIsCiJ0b2tlbiIs',
    },
    executionStartToCloseTimeout: {
      seconds: '1080',
      nanos: 0,
    },
    taskStartToCloseTimeout: {
      seconds: '10',
      nanos: 0,
    },
    decisionTaskCompletedEventId: '17',
    backoffStartInterval: {
      seconds: '55',
      nanos: 0,
    },
    initiator: 'CONTINUE_AS_NEW_INITIATOR_CRON_SCHEDULE',
    failure: null,
    lastCompletionResult: null,
    header: {
      fields: {},
    },
    memo: null,
    searchAttributes: null,
  },
  attributes: 'workflowExecutionContinuedAsNewEventAttributes',
} as const satisfies SingleHistoryEvent;

// TODO: Fill with realistic data
export const requestCancelWorkflowExecutionEvent = {
  eventId: '56',
  eventTime: {
    seconds: '1726046172',
    nanos: 860760687,
  },
  version: '580100',
  taskId: '12690929027',
  workflowExecutionCancelRequestedEventAttributes: {
    cause: '',
    identity: '',
    requestId: '',
    externalExecutionInfo: {
      initiatedId: '',
      workflowExecution: {
        runId: '',
        workflowId: '',
      },
    },
  },
  attributes: 'workflowExecutionCancelRequestedEventAttributes',
} as const satisfies SingleHistoryEvent;
export const cancelWorkflowExecutionEvent = {
  eventId: '57',
  eventTime: {
    seconds: '1726046172',
    nanos: 860760687,
  },
  version: '580100',
  taskId: '12690929027',
  workflowExecutionCanceledEventAttributes: {
    decisionTaskCompletedEventId: '9',
    details: {
      data: 'd29ya2Zsb3cgc2xlZXA6IENhbmNlbGVkRXJyb3I=',
    },
  },
  attributes: 'workflowExecutionCanceledEventAttributes',
} as const satisfies SingleHistoryEvent;

export const upsertWorkflowSearchAttributesEvent = {
  eventId: '58',
  eventTime: {
    seconds: '1726556443',
    nanos: 322569089,
  },
  version: '587402',
  taskId: '6051339897',
  upsertWorkflowSearchAttributesEventAttributes: {
    decisionTaskCompletedEventId: '4',
    searchAttributes: {
      indexedFields: {
        CadenceChangeVersion: {
          data: 'WyJpbml0aWFsIHZlcnNpb24tMyJd',
        },
      },
    },
  },
  attributes: 'upsertWorkflowSearchAttributesEventAttributes',
} as const satisfies SingleHistoryEvent;
