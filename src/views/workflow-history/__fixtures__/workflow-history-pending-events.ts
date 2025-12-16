import type {
  PendingActivityTaskStartEvent,
  PendingDecisionTaskStartEvent,
} from '../workflow-history.types';

import { scheduleActivityTaskEvent } from './workflow-history-activity-events';
import { scheduleDecisionTaskEvent } from './workflow-history-decision-events';

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

// Factory functions for creating test data dynamically

export function createPendingActivity(
  scheduleId: string,
  options?: { activityId?: string }
): PendingActivityTaskStartEvent {
  return {
    ...pendingActivityTaskStartEvent,
    computedEventId: `pending-${scheduleId}`,
    pendingActivityTaskStartEventAttributes: {
      ...pendingActivityTaskStartEvent.pendingActivityTaskStartEventAttributes,
      scheduleId,
      ...(options?.activityId && { activityId: options.activityId }),
    },
  } as PendingActivityTaskStartEvent;
}

export function createPendingDecision(
  scheduleId: string
): PendingDecisionTaskStartEvent {
  return {
    ...pendingDecisionTaskStartEvent,
    computedEventId: `pending-${scheduleId}`,
    pendingDecisionTaskStartEventAttributes: {
      ...pendingDecisionTaskStartEvent.pendingDecisionTaskStartEventAttributes,
      scheduleId,
    },
  } as PendingDecisionTaskStartEvent;
}

export function createScheduleActivityEvent(
  eventId: string,
  options?: { activityId?: string }
) {
  return {
    ...scheduleActivityTaskEvent,
    eventId,
    activityTaskScheduledEventAttributes: {
      ...scheduleActivityTaskEvent.activityTaskScheduledEventAttributes,
      ...(options?.activityId && { activityId: options.activityId }),
    },
  };
}

export function createScheduleDecisionEvent(eventId: string) {
  return {
    ...scheduleDecisionTaskEvent,
    eventId,
  };
}
