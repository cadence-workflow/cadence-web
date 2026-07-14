import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import {
  SCHEDULE_CATCH_UP_POLICIES,
  SCHEDULE_OVERLAP_POLICIES,
} from '@/route-handlers/create-schedule/create-schedule.constants';
import {
  SCHEDULE_CATCH_UP_POLICY_LABELS,
  SCHEDULE_OVERLAP_POLICY_LABELS,
} from '@/views/shared/constants/schedule-policy-labels.constants';

export const MAX_CATCH_UP_WINDOW_DAYS = 90;

/** Stable ids for advanced create-schedule horizontal fields. */
export const CREATE_SCHEDULE_ADVANCED_FIELD_IDS = {
  scheduleId: 'domain-schedules-create-form-schedule-id',
  jitterSeconds: 'domain-schedules-create-form-jitter-seconds',
  workflowIdPrefix: 'domain-schedules-create-form-workflow-id-prefix',
  bufferLimit: 'domain-schedules-create-form-buffer-limit',
  concurrencyLimit: 'domain-schedules-create-form-concurrency-limit',
  catchUpWindowDays: 'domain-schedules-create-form-catch-up-window-days',
  startTime: 'domain-schedules-create-form-start-time',
  endTime: 'domain-schedules-create-form-end-time',
  memo: 'domain-schedules-create-form-memo',
} as const;

export const CREATE_SCHEDULE_ADVANCED_FIELD_DESCRIPTIONS = {
  scheduleId: 'Unique name provided by users to name the schedule.',
  overlapPolicy:
    'Policy that controls what the scheduler should do if the previous action is still running.',
  bufferLimit:
    'Max number of pending workflows allowed when using Buffer overlap policy.',
  concurrencyLimit:
    'Max number of concurrently running workflows allowed for Concurrent overlap policy.',
  catchUpPolicy: 'Controls whether missed schedules should run after downtime.',
  catchUpWindowDays:
    'Maximum age of missed schedules that can still be started.',
  schedulePeriod: 'Optional time range that limits when this schedule can run.',
  searchAttributes:
    'Additional indexed attributes attached to each started workflow.',
  jitterSeconds:
    'Time range to distribute starting workflows across. This helps avoiding burst of workflow creations in a single point of time.',
  workflowIdPrefix:
    'Prefix text to add into started workflows. Ids are formed as `${Prefix}+{auto generated postfix}`.',
  memo: 'JSON object that is attached to each started workflow.',
} as const;

export const DEFAULT_CATCH_UP_POLICY =
  ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP;

export const DEFAULT_OVERLAP_POLICY =
  ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT;

export const OVERLAP_POLICY_OPTIONS = SCHEDULE_OVERLAP_POLICIES.map(
  (policy) => ({
    id: policy,
    label: SCHEDULE_OVERLAP_POLICY_LABELS[policy],
  })
);

export const CATCH_UP_POLICY_OPTIONS = SCHEDULE_CATCH_UP_POLICIES.map(
  (policy) => ({
    id: policy,
    label: SCHEDULE_CATCH_UP_POLICY_LABELS[policy],
  })
);
