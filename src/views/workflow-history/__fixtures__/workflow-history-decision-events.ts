import type { DecisionHistoryEvent } from '../workflow-history.types';

export const scheduleDecisionTaskEvent = {
  eventId: '2',
  eventTime: {
    seconds: '1725747370',
    nanos: 552194764,
  },
  version: '575102',
  taskId: '22647174794',
  decisionTaskScheduledEventAttributes: {
    taskList: {
      name: 'task-queue',
      kind: 'TASK_LIST_KIND_INVALID',
    },
    startToCloseTimeout: {
      seconds: '10',
      nanos: 0,
    },
    attempt: 0,
  },
  attributes: 'decisionTaskScheduledEventAttributes',
} as const satisfies DecisionHistoryEvent;

export const startDecisionTaskEvent = {
  eventId: '3',
  eventTime: {
    seconds: '1725747370',
    nanos: 575409843,
  },
  version: '575102',
  taskId: '22647174798',
  decisionTaskStartedEventAttributes: {
    scheduledEventId: '2',
    identity: 'cadence@958ab341-a376-431b-a17a-ed7d8a97ba92',
    requestId: '66f7f58b-3d3b-4178-972a-fa7825ceec38',
  },
  attributes: 'decisionTaskStartedEventAttributes',
} as const satisfies DecisionHistoryEvent;

export const completeDecisionTaskEvent = {
  eventId: '4',
  eventTime: {
    seconds: '1725747370',
    nanos: 599272941,
  },
  version: '575102',
  taskId: '22647174802',
  decisionTaskCompletedEventAttributes: {
    scheduledEventId: '2',
    startedEventId: '3',
    identity: 'cadence@958ab342-a376-431b-a17a-ed7d8a97ba91',
    binaryChecksum: 'cadence:eb16a90a9182002897d7a6c6585871eedace71d1',
    executionContext: '',
  },
  attributes: 'decisionTaskCompletedEventAttributes',
} as const satisfies DecisionHistoryEvent;

export const failedDecisionTaskEvent = {
  eventId: '5',
  eventTime: {
    seconds: '1725747370',
    nanos: 599272953,
  },
  attributes: 'decisionTaskFailedEventAttributes',
  version: '575102',
  taskId: '22647174902',
  decisionTaskFailedEventAttributes: {
    scheduledEventId: '2',
    startedEventId: '3',
    cause: 'DECISION_TASK_FAILED_CAUSE_BAD_START_CHILD_EXECUTION_ATTRIBUTES',
    failure: {
      reason: '',
      details: 'V29ya2Zsb3dJZCBleGNlZWRzIGxlbmd0aCBsaW1pdC4=',
    },
    identity: 'cadence@958ab341-a375-431b-a27a-ed7d8a97ba91',
    baseRunId: '',
    newRunId: '',
    forkEventVersion: '0',
    binaryChecksum: 'ffc875a4c3571872881f79c939921e00398ab360',
    requestId: '66f7f58b-3d3b-4178-972a-fa7825ceec39',
  },
} as const satisfies DecisionHistoryEvent;

export const timeoutDecisionTaskEvent = {
  eventId: '6',
  eventTime: {
    seconds: '1725747370',
    nanos: 599273063,
  },
  attributes: 'decisionTaskTimedOutEventAttributes',
  version: '575102',
  taskId: '22647174903',
  decisionTaskTimedOutEventAttributes: {
    scheduledEventId: '2',
    startedEventId: '3',
    cause: 'DECISION_TASK_TIMED_OUT_CAUSE_TIMEOUT',
    timeoutType: 'TIMEOUT_TYPE_HEARTBEAT',
    reason: 'Missed heart beat',
    baseRunId: '',
    newRunId: '',
    forkEventVersion: '0',
    requestId: '66f7f58b-3d3b-4178-972a-fa7825ceec40',
  },
} as const satisfies DecisionHistoryEvent;

export const completedDecisionTaskEvents: DecisionHistoryEvent[] = [
  scheduleDecisionTaskEvent,
  startDecisionTaskEvent,
  completeDecisionTaskEvent,
];

export const failedDecisionTaskEvents: DecisionHistoryEvent[] = [
  scheduleDecisionTaskEvent,
  startDecisionTaskEvent,
  failedDecisionTaskEvent,
];

export const timedoutDecisionTaskEvents: DecisionHistoryEvent[] = [
  scheduleDecisionTaskEvent,
  startDecisionTaskEvent,
  timeoutDecisionTaskEvent,
];
