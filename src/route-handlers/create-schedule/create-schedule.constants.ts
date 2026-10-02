import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';

import { WORKER_SDK_LANGUAGES } from '../start-workflow/start-workflow.constants';

export { WORKER_SDK_LANGUAGES };

export const SCHEDULE_OVERLAP_POLICIES = [
  ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW,
  ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
  ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT,
  ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CANCEL_PREVIOUS,
  ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_TERMINATE_PREVIOUS,
] as const;

export const SCHEDULE_CATCH_UP_POLICIES = [
  ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP,
  ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE,
  ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ALL,
] as const;
