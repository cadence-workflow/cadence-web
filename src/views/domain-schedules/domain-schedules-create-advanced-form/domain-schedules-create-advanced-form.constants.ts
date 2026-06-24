import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { SCHEDULE_OVERLAP_POLICIES } from '@/route-handlers/create-schedule/create-schedule.constants';

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
