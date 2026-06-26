import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import {
  SCHEDULE_CATCH_UP_POLICIES,
  SCHEDULE_OVERLAP_POLICIES,
} from '@/route-handlers/create-schedule/create-schedule.constants';

export const MAX_CATCH_UP_WINDOW_DAYS = 90;

/** Stable ids for advanced create-schedule horizontal fields. */
export const CREATE_SCHEDULE_ADVANCED_FIELD_IDS = {
  scheduleId: 'domain-schedules-create-form-schedule-id',
  jitterSeconds: 'domain-schedules-create-form-jitter-seconds',
  workflowIdPrefix: 'domain-schedules-create-form-workflow-id-prefix',
  bufferLimit: 'domain-schedules-create-form-buffer-limit',
  concurrencyLimit: 'domain-schedules-create-form-concurrency-limit',
} as const;

export const CREATE_SCHEDULE_ADVANCED_FIELD_DESCRIPTIONS = {
  scheduleId: 'Unique name provided by users to name the schedule.',
  overlapPolicy:
    'Policy that controls what the scheduler should do if the previous action is still running.',
  bufferLimit:
    'Max number of pending workflows allowed when using Buffer overlap policy.',
  concurrencyLimit:
    'Max number of concurrently running workflows allowed for Concurrent overlap policy.',
  jitterSeconds:
    'Time range to distribute starting workflows across. This helps avoiding burst of workflow creations in a single point of time.',
  workflowIdPrefix:
    'Prefix text to add into started workflows. Ids are formed as `${Prefix}+{auto generated postfix}`.',
} as const;

export const DEFAULT_CATCH_UP_POLICY =
  ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP;

export const DEFAULT_OVERLAP_POLICY =
  ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT;

const overlapPolicyLabels: Record<
  (typeof SCHEDULE_OVERLAP_POLICIES)[number],
  string
> = {
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW]: 'Skip',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER]: 'Buffer',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT]: 'Concurrent',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CANCEL_PREVIOUS]:
    'Cancel previous',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_TERMINATE_PREVIOUS]:
    'Terminate previous',
};

export const OVERLAP_POLICY_OPTIONS = SCHEDULE_OVERLAP_POLICIES.map(
  (policy) => ({
    id: policy,
    label: overlapPolicyLabels[policy],
  })
);

type ScheduleCatchUpPolicyLabelMap = Record<
  (typeof SCHEDULE_CATCH_UP_POLICIES)[number],
  string
>;

const catchUpPolicyLabels: ScheduleCatchUpPolicyLabelMap = {
  [ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP]: 'Skip',
  [ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE]: 'Catch-up one',
  [ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ALL]: 'Catch-up all',
};

export const CATCH_UP_POLICY_OPTIONS = SCHEDULE_CATCH_UP_POLICIES.map(
  (policy) => ({
    id: policy,
    label: catchUpPolicyLabels[policy],
  })
);
