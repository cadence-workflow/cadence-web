import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import {
  type SCHEDULE_CATCH_UP_POLICIES,
  type SCHEDULE_OVERLAP_POLICIES,
} from '@/route-handlers/create-schedule/create-schedule.constants';

/** Cadence server default when describeSchedule omits overlapPolicy (not the create-form default). */
export const SERVER_OVERLAP_POLICY_DEFAULT =
  ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW;

/** Cadence server default when describeSchedule omits catchUpPolicy. */
export const SERVER_CATCH_UP_POLICY_DEFAULT =
  ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP;

export const SCHEDULE_OVERLAP_POLICY_LABELS: Record<
  (typeof SCHEDULE_OVERLAP_POLICIES)[number],
  string
> = {
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW]: 'Skip new',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER]: 'Buffer',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT]: 'Concurrent',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CANCEL_PREVIOUS]:
    'Cancel previous',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_TERMINATE_PREVIOUS]:
    'Terminate previous',
};

export const SCHEDULE_CATCH_UP_POLICY_LABELS: Record<
  (typeof SCHEDULE_CATCH_UP_POLICIES)[number],
  string
> = {
  [ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP]: 'Skip',
  [ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE]: 'Catch-up one',
  [ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ALL]: 'Catch-up all',
};

export const SCHEDULE_OVERLAP_POLICY_DESCRIPTIONS: Record<
  (typeof SCHEDULE_OVERLAP_POLICIES)[number],
  string
> = {
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW]:
    'Do not start a new run while the previous scheduled action is still running.',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER]:
    'Queue upcoming runs while the previous action is still running, up to the buffer limit.',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT]:
    'Allow multiple scheduled actions to run at the same time, up to the concurrency limit.',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CANCEL_PREVIOUS]:
    'Cancel the previous run when the next scheduled time arrives.',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_TERMINATE_PREVIOUS]:
    'Terminate the previous run when the next scheduled time arrives.',
};

export const SCHEDULE_CATCH_UP_POLICY_DESCRIPTIONS: Record<
  (typeof SCHEDULE_CATCH_UP_POLICIES)[number],
  string
> = {
  [ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP]:
    'Do not start workflows for schedule times missed during downtime.',
  [ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE]:
    'Start at most one missed workflow after the schedule becomes active again.',
  [ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ALL]:
    'Start all missed workflows within the catch-up window after downtime.',
};
