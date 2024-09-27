import { z } from 'zod';

import { CancelExternalWorkflowExecutionFailedCause } from '@/__generated__/proto-ts/uber/cadence/api/v1/CancelExternalWorkflowExecutionFailedCause';
import { ChildWorkflowExecutionFailedCause } from '@/__generated__/proto-ts/uber/cadence/api/v1/ChildWorkflowExecutionFailedCause';
import { ContinueAsNewInitiator } from '@/__generated__/proto-ts/uber/cadence/api/v1/ContinueAsNewInitiator';
import { DecisionTaskFailedCause } from '@/__generated__/proto-ts/uber/cadence/api/v1/DecisionTaskFailedCause';
import { DecisionTaskTimedOutCause } from '@/__generated__/proto-ts/uber/cadence/api/v1/DecisionTaskTimedOutCause';
import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { ParentClosePolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ParentClosePolicy';
import { SignalExternalWorkflowExecutionFailedCause } from '@/__generated__/proto-ts/uber/cadence/api/v1/SignalExternalWorkflowExecutionFailedCause';
import { TaskListKind } from '@/__generated__/proto-ts/uber/cadence/api/v1/TaskListKind';
import { TimeoutType } from '@/__generated__/proto-ts/uber/cadence/api/v1/TimeoutType';
import { WorkflowIdReusePolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowIdReusePolicy';

const timestampSchema = z.object({
  seconds: z.string(),
  nanos: z.number(),
});

const workflowTypeSchema = z.object({
  name: z.string(),
});

const workflowExecutionSchema = z.object({
  workflowId: z.string(),
  runId: z.string(),
});
const parentExecutionInfoSchema = z.object({
  domainId: z.string(),
  domainName: z.string(),
  workflowExecution: workflowExecutionSchema.nullable(),
  initiatedId: z.string(),
});

const taskListSchema = z.object({
  name: z.string(),
  kind: z.enum([
    TaskListKind.TASK_LIST_KIND_INVALID,
    TaskListKind.TASK_LIST_KIND_NORMAL,
    TaskListKind.TASK_LIST_KIND_STICKY,
  ]),
});

const payloadSchema = z.object({
  data: z.string(),
});

const durationSchema = z.object({
  // Seconds is recieved as a numeric value if it is 0
  // this is unexpected behavior from grpc protoLoader
  // coerce the value to string to avoid the issue
  seconds: z.coerce.string(),
  nanos: z.number(),
});

const continueAsNewInitiatorSchema = z.enum([
  ContinueAsNewInitiator.CONTINUE_AS_NEW_INITIATOR_INVALID,
  ContinueAsNewInitiator.CONTINUE_AS_NEW_INITIATOR_DECIDER,
  ContinueAsNewInitiator.CONTINUE_AS_NEW_INITIATOR_RETRY_POLICY,
  ContinueAsNewInitiator.CONTINUE_AS_NEW_INITIATOR_CRON_SCHEDULE,
]);

const timeoutTypeSchema = z.enum([
  TimeoutType.TIMEOUT_TYPE_HEARTBEAT,
  TimeoutType.TIMEOUT_TYPE_INVALID,
  TimeoutType.TIMEOUT_TYPE_SCHEDULE_TO_CLOSE,
  TimeoutType.TIMEOUT_TYPE_SCHEDULE_TO_START,
  TimeoutType.TIMEOUT_TYPE_START_TO_CLOSE,
]);

const decisionTaskTimedOutCauseSchema = z.enum([
  DecisionTaskTimedOutCause.DECISION_TASK_TIMED_OUT_CAUSE_INVALID,
  DecisionTaskTimedOutCause.DECISION_TASK_TIMED_OUT_CAUSE_RESET,
  DecisionTaskTimedOutCause.DECISION_TASK_TIMED_OUT_CAUSE_TIMEOUT,
]);

const decisionTaskFailedCauseSchema = z.enum([
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_INVALID,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_UNHANDLED_DECISION,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_SCHEDULE_ACTIVITY_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_REQUEST_CANCEL_ACTIVITY_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_START_TIMER_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_CANCEL_TIMER_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_RECORD_MARKER_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_COMPLETE_WORKFLOW_EXECUTION_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_FAIL_WORKFLOW_EXECUTION_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_CANCEL_WORKFLOW_EXECUTION_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_REQUEST_CANCEL_EXTERNAL_WORKFLOW_EXECUTION_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_CONTINUE_AS_NEW_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_START_TIMER_DUPLICATE_ID,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_RESET_STICKY_TASK_LIST,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_WORKFLOW_WORKER_UNHANDLED_FAILURE,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_SIGNAL_WORKFLOW_EXECUTION_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_START_CHILD_EXECUTION_ATTRIBUTES,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_FORCE_CLOSE_DECISION,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_FAILOVER_CLOSE_DECISION,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_SIGNAL_INPUT_SIZE,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_RESET_WORKFLOW,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_BINARY,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_SCHEDULE_ACTIVITY_DUPLICATE_ID,
  DecisionTaskFailedCause.DECISION_TASK_FAILED_CAUSE_BAD_SEARCH_ATTRIBUTES,
]);

const cancelExternalWorkflowExecutionFailedCauseSchema = z.enum([
  CancelExternalWorkflowExecutionFailedCause.CANCEL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_INVALID,
  CancelExternalWorkflowExecutionFailedCause.CANCEL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_UNKNOWN_EXTERNAL_WORKFLOW_EXECUTION,
  CancelExternalWorkflowExecutionFailedCause.CANCEL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_WORKFLOW_ALREADY_COMPLETED,
]);

const parentClosePolicySchema = z.enum([
  ParentClosePolicy.PARENT_CLOSE_POLICY_INVALID,
  ParentClosePolicy.PARENT_CLOSE_POLICY_ABANDON,
  ParentClosePolicy.PARENT_CLOSE_POLICY_REQUEST_CANCEL,
  ParentClosePolicy.PARENT_CLOSE_POLICY_TERMINATE,
]);

const workflowIdReusePolicySchema = z.enum([
  WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_INVALID,
  WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE_FAILED_ONLY,
  WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE,
  WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE,
  WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_TERMINATE_IF_RUNNING,
]);

const childWorkflowExecutionFailedCauseSchema = z.enum([
  ChildWorkflowExecutionFailedCause.CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_INVALID,
  ChildWorkflowExecutionFailedCause.CHILD_WORKFLOW_EXECUTION_FAILED_CAUSE_WORKFLOW_ALREADY_RUNNING,
]);

const signalExternalWorkflowExecutionFailedCauseSchema = z.enum([
  SignalExternalWorkflowExecutionFailedCause.SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_INVALID,
  SignalExternalWorkflowExecutionFailedCause.SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_UNKNOWN_EXTERNAL_WORKFLOW_EXECUTION,
  SignalExternalWorkflowExecutionFailedCause.SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_WORKFLOW_ALREADY_COMPLETED,
]);

const failureSchema = z.object({
  reason: z.string(),
  details: z.string(),
});

const retryPolicySchema = z.object({
  initialInterval: durationSchema.nullable(),
  backoffCoefficient: z.number(),
  maximumInterval: durationSchema.nullable(),
  maximumAttempts: z.number(),
  nonRetryableErrorReasons: z.array(z.string()),
  expirationInterval: durationSchema.nullable(),
});

const memoSchema = z.object({
  fields: z.record(z.string(), payloadSchema),
});

const searchAttributesSchema = z.object({
  indexedFields: z.record(z.string(), payloadSchema),
});

const headerSchema = z.object({
  fields: z.record(z.string(), payloadSchema),
});

const resetPointInfoSchema = z.object({
  binaryChecksum: z.string(),
  runId: z.string(),
  firstDecisionCompletedId: z.string(),
  createdTime: timestampSchema.nullable(),
  expiringTime: timestampSchema.nullable(),
  resettable: z.boolean(),
});

const resetPointsSchema = z.object({
  points: z.array(resetPointInfoSchema),
});

const activityTypeSchema = z.object({
  name: z.string(),
});

const externalExecutionInfoSchema = z.object({
  workflowExecution: workflowExecutionSchema.nullable(),
  initiatedId: z.string(),
});

const historyEventBaseSchema = z.object({
  eventId: z.string(),
  eventTime: timestampSchema.nullable(),
  version: z.string(),
  taskId: z.string(),
});

export const workflowExecutionStartedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('workflowExecutionStartedEventAttributes'),
    workflowExecutionStartedEventAttributes: z.object({
      workflowType: workflowTypeSchema.nullable(),
      parentExecutionInfo: parentExecutionInfoSchema.nullable(),
      taskList: taskListSchema.nullable(),
      input: payloadSchema.nullable(),
      executionStartToCloseTimeout: durationSchema.nullable(),
      taskStartToCloseTimeout: durationSchema.nullable(),
      continuedExecutionRunId: z.string(),
      initiator: continueAsNewInitiatorSchema,
      continuedFailure: failureSchema.nullable(),
      lastCompletionResult: payloadSchema.nullable(),
      originalExecutionRunId: z.string(),
      identity: z.string(),
      firstExecutionRunId: z.string(),
      retryPolicy: retryPolicySchema.nullable(),
      attempt: z.number(),
      expirationTime: timestampSchema.nullable(),
      cronSchedule: z.string(),
      firstDecisionTaskBackoff: durationSchema.nullable(),
      memo: memoSchema.nullable(),
      searchAttributes: searchAttributesSchema.nullable(),
      prevAutoResetPoints: resetPointsSchema.nullable(),
      header: headerSchema.nullable(),
      firstScheduledTime: timestampSchema.nullable(),
      partitionConfig: z.record(z.string()),
      requestId: z.string(),
    }),
  });

export const workflowExecutionCompletedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('workflowExecutionCompletedEventAttributes'),
    workflowExecutionCompletedEventAttributes: z.object({
      result: payloadSchema.nullable(),
      decisionTaskCompletedEventId: z.string(),
    }),
  });

export const workflowExecutionFailedEventSchema = historyEventBaseSchema.extend(
  {
    attributes: z.literal('workflowExecutionFailedEventAttributes'),
    workflowExecutionFailedEventAttributes: z.object({
      failure: failureSchema.nullable(),
      decisionTaskCompletedEventId: z.string(),
    }),
  }
);

export const workflowExecutionTimedOutEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('workflowExecutionTimedOutEventAttributes'),
    workflowExecutionTimedOutEventAttributes: z.object({
      timeoutType: timeoutTypeSchema,
    }),
  });

export const workflowExecutionSignaledEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('workflowExecutionSignaledEventAttributes'),
    workflowExecutionSignaledEventAttributes: z.object({
      signalName: z.string(),
      input: payloadSchema.nullable(),
      identity: z.string(),
      requestId: z.string(),
    }),
  });

export const decisionTaskScheduledEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('decisionTaskScheduledEventAttributes'),
  decisionTaskScheduledEventAttributes: z.object({
    taskList: taskListSchema.nullable(),
    startToCloseTimeout: durationSchema.nullable(),
    attempt: z.number(),
  }),
});

export const decisionTaskStartedEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('decisionTaskStartedEventAttributes'),
  decisionTaskStartedEventAttributes: z.object({
    scheduledEventId: z.string(),
    identity: z.string(),
    requestId: z.string(),
  }),
});

export const decisionTaskCompletedEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('decisionTaskCompletedEventAttributes'),
  decisionTaskCompletedEventAttributes: z.object({
    scheduledEventId: z.string(),
    startedEventId: z.string(),
    identity: z.string(),
    binaryChecksum: z.string(),
    executionContext: z.string(),
  }),
});

export const decisionTaskTimedOutEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('decisionTaskTimedOutEventAttributes'),
  decisionTaskTimedOutEventAttributes: z.object({
    scheduledEventId: z.string(),
    startedEventId: z.string(),
    timeoutType: timeoutTypeSchema,
    baseRunId: z.string(),
    newRunId: z.string(),
    forkEventVersion: z.string(),
    reason: z.string(),
    cause: decisionTaskTimedOutCauseSchema,
    requestId: z.string(),
  }),
});

export const decisionTaskFailedEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('decisionTaskFailedEventAttributes'),
  decisionTaskFailedEventAttributes: z.object({
    scheduledEventId: z.string(),
    startedEventId: z.string(),
    cause: decisionTaskFailedCauseSchema,
    failure: failureSchema.nullable(),
    identity: z.string(),
    baseRunId: z.string(),
    newRunId: z.string(),
    forkEventVersion: z.string(),
    binaryChecksum: z.string(),
    requestId: z.string(),
  }),
});

export const activityTaskScheduledEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('activityTaskScheduledEventAttributes'),
  activityTaskScheduledEventAttributes: z.object({
    activityId: z.string(),
    activityType: activityTypeSchema.nullable(),
    domain: z.string(),
    taskList: taskListSchema.nullable(),
    input: payloadSchema.nullable(),
    scheduleToCloseTimeout: durationSchema.nullable(),
    scheduleToStartTimeout: durationSchema.nullable(),
    startToCloseTimeout: durationSchema.nullable(),
    heartbeatTimeout: durationSchema.nullable(),
    decisionTaskCompletedEventId: z.string(),
    retryPolicy: retryPolicySchema.nullable(),
    header: headerSchema.nullable(),
  }),
});

export const activityTaskStartedEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('activityTaskStartedEventAttributes'),
  activityTaskStartedEventAttributes: z.object({
    scheduledEventId: z.string(),
    identity: z.string(),
    requestId: z.string(),
    attempt: z.number(),
    lastFailure: failureSchema.nullable(),
  }),
});

export const activityTaskCompletedEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('activityTaskCompletedEventAttributes'),
  activityTaskCompletedEventAttributes: z.object({
    result: payloadSchema.nullable(),
    scheduledEventId: z.string(),
    startedEventId: z.string(),
    identity: z.string(),
  }),
});

export const activityTaskFailedEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('activityTaskFailedEventAttributes'),
  activityTaskFailedEventAttributes: z.object({
    failure: failureSchema.nullable(),
    scheduledEventId: z.string(),
    startedEventId: z.string(),
    identity: z.string(),
  }),
});

export const activityTaskTimedOutEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('activityTaskTimedOutEventAttributes'),
  activityTaskTimedOutEventAttributes: z.object({
    details: payloadSchema.nullable(),
    scheduledEventId: z.string(),
    startedEventId: z.string(),
    timeoutType: timeoutTypeSchema,
    lastFailure: failureSchema.nullable(),
  }),
});

export const activityTaskCancelRequestedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('activityTaskCancelRequestedEventAttributes'),
    activityTaskCancelRequestedEventAttributes: z.object({
      activityId: z.string(),
      decisionTaskCompletedEventId: z.string(),
    }),
  });

export const activityTaskCanceledEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('activityTaskCanceledEventAttributes'),
  activityTaskCanceledEventAttributes: z.object({
    details: payloadSchema.nullable(),
    latestCancelRequestedEventId: z.string(),
    scheduledEventId: z.string(),
    startedEventId: z.string(),
    identity: z.string(),
  }),
});

export const requestCancelActivityTaskFailedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('requestCancelActivityTaskFailedEventAttributes'),
    requestCancelActivityTaskFailedEventAttributes: z.object({
      activityId: z.string(),
      cause: z.string(),
      decisionTaskCompletedEventId: z.string(),
    }),
  });

export const timerStartedEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('timerStartedEventAttributes'),
  timerStartedEventAttributes: z.object({
    timerId: z.string(),
    startToFireTimeout: durationSchema.nullable(),
    decisionTaskCompletedEventId: z.string(),
  }),
});

export const timerFiredEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('timerFiredEventAttributes'),
  timerFiredEventAttributes: z.object({
    timerId: z.string(),
    startedEventId: z.string(),
  }),
});

export const timerCanceledEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('timerCanceledEventAttributes'),
  timerCanceledEventAttributes: z.object({
    timerId: z.string(),
    startedEventId: z.string(),
    decisionTaskCompletedEventId: z.string(),
    identity: z.string(),
  }),
});

export const cancelTimerFailedEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('cancelTimerFailedEventAttributes'),
  cancelTimerFailedEventAttributes: z.object({
    timerId: z.string(),
    cause: z.string(),
    decisionTaskCompletedEventId: z.string(),
    identity: z.string(),
  }),
});

export const markerRecordedEventSchema = historyEventBaseSchema.extend({
  attributes: z.literal('markerRecordedEventAttributes'),
  markerRecordedEventAttributes: z.object({
    markerName: z.string(),
    details: payloadSchema.nullable(),
    decisionTaskCompletedEventId: z.string(),
    header: headerSchema.nullable(),
  }),
});

export const workflowExecutionTerminatedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('workflowExecutionTerminatedEventAttributes'),
    workflowExecutionTerminatedEventAttributes: z.object({
      reason: z.string(),
      details: payloadSchema.nullable(),
      identity: z.string(),
    }),
  });

export const externalWorkflowExecutionCancelRequestedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal(
      'externalWorkflowExecutionCancelRequestedEventAttributes'
    ),
    externalWorkflowExecutionCancelRequestedEventAttributes: z.object({
      initiatedEventId: z.string(),
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
    }),
  });

export const workflowExecutionCanceledEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('workflowExecutionCanceledEventAttributes'),
    workflowExecutionCanceledEventAttributes: z.object({
      decisionTaskCompletedEventId: z.string(),
      details: payloadSchema.nullable(),
    }),
  });

export const requestCancelExternalWorkflowExecutionInitiatedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal(
      'requestCancelExternalWorkflowExecutionInitiatedEventAttributes'
    ),
    requestCancelExternalWorkflowExecutionInitiatedEventAttributes: z.object({
      decisionTaskCompletedEventId: z.string(),
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
      control: z.string(),
      childWorkflowOnly: z.boolean(),
    }),
  });

export const requestCancelExternalWorkflowExecutionFailedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal(
      'requestCancelExternalWorkflowExecutionFailedEventAttributes'
    ),
    requestCancelExternalWorkflowExecutionFailedEventAttributes: z.object({
      cause: cancelExternalWorkflowExecutionFailedCauseSchema,
      decisionTaskCompletedEventId: z.string(),
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
      initiatedEventId: z.string(),
      control: z.string(),
    }),
  });

export const workflowExecutionContinuedAsNewEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('workflowExecutionContinuedAsNewEventAttributes'),
    workflowExecutionContinuedAsNewEventAttributes: z.object({
      newExecutionRunId: z.string(),
      workflowType: workflowTypeSchema.nullable(),
      taskList: taskListSchema.nullable(),
      input: payloadSchema.nullable(),
      executionStartToCloseTimeout: durationSchema.nullable(),
      taskStartToCloseTimeout: durationSchema.nullable(),
      decisionTaskCompletedEventId: z.string(),
      backoffStartInterval: durationSchema.nullable(),
      initiator: continueAsNewInitiatorSchema,
      failure: failureSchema.nullable(),
      lastCompletionResult: payloadSchema.nullable(),
      header: headerSchema.nullable(),
      memo: memoSchema.nullable(),
      searchAttributes: searchAttributesSchema.nullable(),
    }),
  });

export const workflowExecutionCancelRequestedEventAttributesSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('workflowExecutionCancelRequestedEventAttributes'),
    workflowExecutionCancelRequestedEventAttributes: z.object({
      cause: z.string(),
      identity: z.string(),
      externalExecutionInfo: externalExecutionInfoSchema.nullable(),
      requestId: z.string(),
    }),
  });

export const startChildWorkflowExecutionInitiatedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal(
      'startChildWorkflowExecutionInitiatedEventAttributes'
    ),
    startChildWorkflowExecutionInitiatedEventAttributes: z.object({
      domain: z.string(),
      workflowId: z.string(),
      workflowType: workflowTypeSchema.nullable(),
      taskList: taskListSchema.nullable(),
      input: payloadSchema.nullable(),
      executionStartToCloseTimeout: durationSchema.nullable(),
      taskStartToCloseTimeout: durationSchema.nullable(),
      parentClosePolicy: parentClosePolicySchema,
      control: z.string(),
      decisionTaskCompletedEventId: z.string(),
      workflowIdReusePolicy: workflowIdReusePolicySchema,
      retryPolicy: retryPolicySchema.nullable(),
      cronSchedule: z.string(),
      header: headerSchema.nullable(),
      memo: memoSchema.nullable(),
      searchAttributes: searchAttributesSchema.nullable(),
      delayStart: durationSchema.nullable(),
      jitterStart: durationSchema.nullable(),
      firstRunAt: timestampSchema.nullable(),
    }),
  });

export const startChildWorkflowExecutionFailedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('startChildWorkflowExecutionFailedEventAttributes'),
    startChildWorkflowExecutionFailedEventAttributes: z.object({
      domain: z.string(),
      workflowId: z.string(),
      workflowType: workflowTypeSchema.nullable(),
      cause: childWorkflowExecutionFailedCauseSchema,
      control: z.string(),
      initiatedEventId: z.string(),
      decisionTaskCompletedEventId: z.string(),
    }),
  });

export const childWorkflowExecutionStartedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('childWorkflowExecutionStartedEventAttributes'),
    childWorkflowExecutionStartedEventAttributes: z.object({
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
      workflowType: workflowTypeSchema.nullable(),
      initiatedEventId: z.string(),
      header: headerSchema.nullable(),
    }),
  });

export const childWorkflowExecutionCompletedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('childWorkflowExecutionCompletedEventAttributes'),
    childWorkflowExecutionCompletedEventAttributes: z.object({
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
      workflowType: workflowTypeSchema.nullable(),
      initiatedEventId: z.string(),
      startedEventId: z.string(),
      result: payloadSchema.nullable(),
    }),
  });

export const childWorkflowExecutionFailedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('childWorkflowExecutionFailedEventAttributes'),
    childWorkflowExecutionFailedEventAttributes: z.object({
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
      workflowType: workflowTypeSchema.nullable(),
      initiatedEventId: z.string(),
      startedEventId: z.string(),
      failure: failureSchema.nullable(),
    }),
  });

export const childWorkflowExecutionCanceledEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('childWorkflowExecutionCanceledEventAttributes'),
    childWorkflowExecutionCanceledEventAttributes: z.object({
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
      workflowType: workflowTypeSchema.nullable(),
      initiatedEventId: z.string(),
      startedEventId: z.string(),
      details: payloadSchema.nullable(),
    }),
  });

export const childWorkflowExecutionTimedOutEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('childWorkflowExecutionTimedOutEventAttributes'),
    childWorkflowExecutionTimedOutEventAttributes: z.object({
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
      workflowType: workflowTypeSchema.nullable(),
      initiatedEventId: z.string(),
      startedEventId: z.string(),
      timeoutType: timeoutTypeSchema,
    }),
  });

export const childWorkflowExecutionTerminatedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('childWorkflowExecutionTerminatedEventAttributes'),
    childWorkflowExecutionTerminatedEventAttributes: z.object({
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
      workflowType: workflowTypeSchema.nullable(),
      initiatedEventId: z.string(),
      startedEventId: z.string(),
    }),
  });

export const signalExternalWorkflowExecutionInitiatedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal(
      'signalExternalWorkflowExecutionInitiatedEventAttributes'
    ),
    signalExternalWorkflowExecutionInitiatedEventAttributes: z.object({
      decisionTaskCompletedEventId: z.string(),
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
      signalName: z.string(),
      input: payloadSchema.nullable(),
      control: z.string(),
      childWorkflowOnly: z.boolean(),
    }),
  });

export const signalExternalWorkflowExecutionFailedEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal(
      'signalExternalWorkflowExecutionFailedEventAttributes'
    ),
    signalExternalWorkflowExecutionFailedEventAttributes: z.object({
      cause: signalExternalWorkflowExecutionFailedCauseSchema,
      decisionTaskCompletedEventId: z.string(),
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
      initiatedEventId: z.string(),
      control: z.string(),
    }),
  });

export const externalWorkflowExecutionSignaledEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('externalWorkflowExecutionSignaledEventAttributes'),
    externalWorkflowExecutionSignaledEventAttributes: z.object({
      initiatedEventId: z.string(),
      domain: z.string(),
      workflowExecution: workflowExecutionSchema.nullable(),
      control: z.string(),
    }),
  });

export const upsertWorkflowSearchAttributesEventSchema =
  historyEventBaseSchema.extend({
    attributes: z.literal('upsertWorkflowSearchAttributesEventAttributes'),
    upsertWorkflowSearchAttributesEventAttributes: z.object({
      decisionTaskCompletedEventId: z.string(),
      searchAttributes: searchAttributesSchema.nullable(),
    }),
  });

export const historyEventSchema = z.discriminatedUnion('attributes', [
  workflowExecutionStartedEventSchema,
  workflowExecutionCompletedEventSchema,
  workflowExecutionFailedEventSchema,
  workflowExecutionTimedOutEventSchema,
  workflowExecutionSignaledEventSchema,
  workflowExecutionTerminatedEventSchema,
  workflowExecutionCanceledEventSchema,
  workflowExecutionContinuedAsNewEventSchema,
  workflowExecutionCancelRequestedEventAttributesSchema,
  decisionTaskScheduledEventSchema,
  decisionTaskStartedEventSchema,
  decisionTaskCompletedEventSchema,
  decisionTaskTimedOutEventSchema,
  decisionTaskFailedEventSchema,
  activityTaskScheduledEventSchema,
  activityTaskStartedEventSchema,
  activityTaskCompletedEventSchema,
  activityTaskFailedEventSchema,
  activityTaskTimedOutEventSchema,
  activityTaskCancelRequestedEventSchema,
  activityTaskCanceledEventSchema,
  requestCancelActivityTaskFailedEventSchema,
  timerStartedEventSchema,
  timerFiredEventSchema,
  timerCanceledEventSchema,
  cancelTimerFailedEventSchema,
  markerRecordedEventSchema,
  externalWorkflowExecutionCancelRequestedEventSchema,
  externalWorkflowExecutionSignaledEventSchema,
  requestCancelExternalWorkflowExecutionInitiatedEventSchema,
  requestCancelExternalWorkflowExecutionFailedEventSchema,
  signalExternalWorkflowExecutionInitiatedEventSchema,
  signalExternalWorkflowExecutionFailedEventSchema,
  startChildWorkflowExecutionInitiatedEventSchema,
  startChildWorkflowExecutionFailedEventSchema,
  childWorkflowExecutionStartedEventSchema,
  childWorkflowExecutionCompletedEventSchema,
  childWorkflowExecutionFailedEventSchema,
  childWorkflowExecutionCanceledEventSchema,
  childWorkflowExecutionTimedOutEventSchema,
  childWorkflowExecutionTerminatedEventSchema,
  upsertWorkflowSearchAttributesEventSchema,
] as const satisfies z.ZodType<HistoryEvent>[]); // makes sure all schemas accept/return HistoryEvent
