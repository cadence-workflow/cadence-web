import { z } from 'zod';

import { PendingActivityState } from '@/__generated__/proto-ts/uber/cadence/api/v1/PendingActivityState';
import { PendingDecisionState } from '@/__generated__/proto-ts/uber/cadence/api/v1/PendingDecisionState';

const timestampSchema = z.object({
  seconds: z.string(),
  nanos: z.number(),
});

const payloadSchema = z.object({
  data: z.string(),
});

const activityTypeSchema = z.object({
  name: z.string(),
});

const failureSchema = z.object({
  reason: z.string(),
  details: z.string(),
});

export const pendingActivityTaskStartSchema = z.object({
  attributes: z.literal('pendingActivityTaskStartEventAttributes'),
  eventTime: timestampSchema.nullable(),
  eventId: z.null(),
  computedEventId: z.string(),
  pendingActivityTaskStartEventAttributes: z.object({
    activityId: z.string(),
    activityType: activityTypeSchema.nullable(),
    state: z.literal(PendingActivityState.PENDING_ACTIVITY_STATE_STARTED),
    heartbeatDetails: payloadSchema.nullable(),
    lastHeartbeatTime: timestampSchema.nullable(),
    lastStartedTime: timestampSchema.nullable(),
    scheduledTime: timestampSchema.nullable(),
    expirationTime: timestampSchema.nullable(),
    attempt: z.number(),
    maximumAttempts: z.number(),
    lastFailure: failureSchema.nullable(),
    lastWorkerIdentity: z.string(),
    startedWorkerIdentity: z.string(),
    scheduleId: z.string(),
  }),
});

export const pendingDecisionTaskScheduleSchema = z.object({
  attributes: z.literal('pendingDecisionTaskScheduleEventAttributes'),
  eventTime: timestampSchema.nullable(),
  eventId: z.string(),
  pendingDecisionTaskScheduleEventAttributes: z.object({
    state: z.literal(PendingDecisionState.PENDING_DECISION_STATE_SCHEDULED),
    scheduledTime: timestampSchema.nullable(),
    startedTime: timestampSchema.nullable(),
    attempt: z.number(),
    originalScheduledTime: timestampSchema.nullable(),
    scheduleId: z.string(),
  }),
});
