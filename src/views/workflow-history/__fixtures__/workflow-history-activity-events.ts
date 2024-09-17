import type { ActivityHistoryEvent } from '../workflow-history.types';

export const scheduleActivityTaskEvent = {
  eventId: '7',
  eventTime: {
    seconds: '1725747370',
    nanos: 599513558,
  },
  version: '575102',
  taskId: '22647174805',
  activityTaskScheduledEventAttributes: {
    activityId: '0',
    activityType: {
      name: 'activity.cron.Start',
    },
    domain: '',
    taskList: {
      name: 'task-queue',
      kind: 'TASK_LIST_KIND_INVALID',
    },
    input: {
      data: 'MTcyNTc0NzM3MDU3NTQwOTg0MwoiZ2FkZW5jZS1jYW5hcnkteGRjIgoid29ya2Zsb3cuc2FuaXR5Igo=',
    },
    scheduleToCloseTimeout: {
      seconds: '360',
      nanos: 0,
    },
    scheduleToStartTimeout: {
      seconds: '180',
      nanos: 0,
    },
    startToCloseTimeout: {
      seconds: '180',
      nanos: 0,
    },
    heartbeatTimeout: {
      seconds: '0',
      nanos: 0,
    },
    decisionTaskCompletedEventId: '4',
    retryPolicy: null,
    header: {
      fields: {
        'test-field': {
          data: 'MWtxcHRkYXk4aEB4dS0xM3R0N20=',
        },
      },
    },
  },
  attributes: 'activityTaskScheduledEventAttributes',
} as const satisfies ActivityHistoryEvent;

export const startActivityTaskEvent = {
  eventId: '9',
  eventTime: {
    seconds: '1725747370',
    nanos: 599547391,
  },
  version: '575102',
  taskId: '22647174807',
  activityTaskStartedEventAttributes: {
    scheduledEventId: '7',
    identity: 'cadence@958ab341-a375-431b-a17a-ed7d8a97ba91',
    requestId: '27e61b29-7rc9-48f4-9e78-0366e9ffd413',
    attempt: 0,
    lastFailure: {
      reason: '',
      details: '',
    },
  },
  attributes: 'activityTaskStartedEventAttributes',
} as const satisfies ActivityHistoryEvent;

export const completeActivityTaskEvent = {
  eventId: '10',
  eventTime: {
    seconds: '1725747370',
    nanos: 632072806,
  },
  version: '575102',
  taskId: '22647174813',
  activityTaskCompletedEventAttributes: {
    result: null,
    scheduledEventId: '7',
    startedEventId: '9',
    identity: 'cadence@958ab341-a386-431b-a17a-ed7d8a97ba91',
  },
  attributes: 'activityTaskCompletedEventAttributes',
} as const satisfies ActivityHistoryEvent;

export const failedActivityTaskEvent = {
  eventId: '11',
  eventTime: {
    seconds: '1725747370',
    nanos: 632072806,
  },
  version: '575102',
  taskId: '22647174813',
  activityTaskFailedEventAttributes: {
    failure: null,
    scheduledEventId: '7',
    startedEventId: '9',
    identity: 'cadence@958ab341-a376-431n-a17a-ed7d8a97ba91',
  },
  attributes: 'activityTaskFailedEventAttributes',
} as const satisfies ActivityHistoryEvent;

export const timeoutActivityTaskEvent = {
  eventId: '12',
  eventTime: {
    seconds: '1725747370',
    nanos: 632072806,
  },
  version: '575102',
  taskId: '22647174813',
  activityTaskTimedOutEventAttributes: {
    details: null,
    scheduledEventId: '7',
    startedEventId: '9',
    lastFailure: null,
    timeoutType: 'TIMEOUT_TYPE_START_TO_CLOSE',
  },
  attributes: 'activityTaskTimedOutEventAttributes',
} as const satisfies ActivityHistoryEvent;

export const cancelActivityTaskEvent = {
  eventId: '14',
  eventTime: {
    seconds: '1725747370',
    nanos: 632072806,
  },
  version: '575102',
  taskId: '22647174813',
  activityTaskCanceledEventAttributes: {
    details: null,
    scheduledEventId: '7',
    startedEventId: '9',
    identity: 'canary@958hb341-a376-431b-a17a-ed7d8a97ba91',
    latestCancelRequestedEventId: '13',
  },
  attributes: 'activityTaskCanceledEventAttributes',
} as const satisfies ActivityHistoryEvent;

export const completedActivityTaskEvents: ActivityHistoryEvent[] = [
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
  completeActivityTaskEvent,
];

export const failedActivityTaskEvents: ActivityHistoryEvent[] = [
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
  failedActivityTaskEvent,
];

export const timedoutActivityTaskEvents: ActivityHistoryEvent[] = [
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
  timeoutActivityTaskEvent,
];
