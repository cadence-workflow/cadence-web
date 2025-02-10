import type {
  PendingActivityTaskStartEvent,
  PendingDecisionTaskScheduleEvent,
} from '../workflow-history.types';

export const pendingActivityTaskStartEvent = {
  eventId: null,
  computedEventId: 'pending-16',
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
    startedWorkerIdentity: '',
    state: 'PENDING_ACTIVITY_STATE_STARTED',
  },
} as const satisfies PendingActivityTaskStartEvent;

export const pendingDecisionTaskScheduleEvent = {
  eventId: '2',
  attributes: 'pendingDecisionTaskScheduleEventAttributes',
  eventTime: {
    seconds: '1725747370',
    nanos: 599547391,
  },
  pendingDecisionTaskScheduleEventAttributes: {
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
} as const satisfies PendingDecisionTaskScheduleEvent;
