import type {
  PendingActivityTaskStartEvent,
  PendingDecisionTaskStartEvent,
} from '../workflow-history.types';

export const pendingActivityTaskStartEvent = {
  eventId: null,
  computedEventId: 'pending-7',
  attributes: 'pendingActivityTaskStartEventAttributes',
  eventTime: {
    seconds: '1725747370',
    nanos: 599547391,
  },
  pendingActivityTaskStartEventAttributes: {
    activityId: '0',
    activityType: {
      name: 'activity.cron.Start',
    },
    heartbeatDetails: {
      data: 'MTcyNTc0NzM3MDU3NTQwOTg0MwoiZ2FkZW5jZS1jYW5hcnkteGRjIgoid29ya2Zsb3cuc2FuaXR5Igo=',
    },
    attempt: 1,
    expirationTime: {
      seconds: '360',
      nanos: 0,
    },
    lastFailure: {
      reason: '',
      details: '',
    },
    lastHeartbeatTime: null,
    lastStartedTime: null,
    lastWorkerIdentity: '',
    maximumAttempts: 10,
    scheduledTime: {
      seconds: '180',
      nanos: 0,
    },
    scheduleId: '7',
    startedWorkerIdentity: 'worker-1',
    state: 'PENDING_ACTIVITY_STATE_SCHEDULED',
  },
} as const satisfies PendingActivityTaskStartEvent;

export const pendingActivityTaskStartEventWithStartedState = {
  ...pendingActivityTaskStartEvent,
  pendingActivityTaskStartEventAttributes: {
    ...pendingActivityTaskStartEvent.pendingActivityTaskStartEventAttributes,
    state: 'PENDING_ACTIVITY_STATE_STARTED',
    lastStartedTime: {
      seconds: '1725747370',
      nanos: 599547391,
    },
  },
} as const satisfies PendingActivityTaskStartEvent;

export const pendingActivityTaskStartEventWithCancelRequestedState = {
  ...pendingActivityTaskStartEventWithStartedState,
  pendingActivityTaskStartEventAttributes: {
    ...pendingActivityTaskStartEventWithStartedState.pendingActivityTaskStartEventAttributes,
    state: 'PENDING_ACTIVITY_STATE_CANCEL_REQUESTED',
  },
} as const satisfies PendingActivityTaskStartEvent;

export const pendingDecisionTaskStartEvent = {
  eventId: null,
  computedEventId: 'pending-7',
  attributes: 'pendingDecisionTaskStartEventAttributes',
  eventTime: {
    seconds: '1725747370',
    nanos: 599547391,
  },
  pendingDecisionTaskStartEventAttributes: {
    originalScheduledTime: null,
    startedTime: null,
    attempt: 1,
    scheduledTime: {
      seconds: '180',
      nanos: 0,
    },
    scheduleId: '7',
    state: 'PENDING_DECISION_STATE_SCHEDULED',
  },
} as const satisfies PendingDecisionTaskStartEvent;

export const pendingDecisionTaskStartEventWithStartedState = {
  ...pendingDecisionTaskStartEvent,
  pendingDecisionTaskStartEventAttributes: {
    ...pendingDecisionTaskStartEvent.pendingDecisionTaskStartEventAttributes,
    state: 'PENDING_DECISION_STATE_STARTED',
    startedTime: {
      seconds: '1725747370',
      nanos: 599547391,
    },
  },
} as const satisfies PendingDecisionTaskStartEvent;
