import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { type ScheduleDetailRowConfig } from '@/views/schedule-details/schedule-details.types';

import { formatScheduleEnumWithDefault } from '../helpers/format-schedule-enum-with-default';
import { formatScheduleLimitValue } from '../helpers/format-schedule-limit-value';

const schedulePoliciesDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'overlapPolicy',
    getLabel: () => 'Overlap policy',
    getValue: ({ describeSchedule }) =>
      formatScheduleEnumWithDefault(
        describeSchedule.policies?.overlapPolicy,
        'SCHEDULE_OVERLAP_POLICY',
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW
      ),
  },
  {
    key: 'catchUpPolicy',
    getLabel: () => 'Catchup policy',
    getValue: ({ describeSchedule }) =>
      formatScheduleEnumWithDefault(
        describeSchedule.policies?.catchUpPolicy,
        'SCHEDULE_CATCH_UP_POLICY',
        ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP
      ),
  },
  {
    key: 'pauseOnFailure',
    getLabel: () => 'Pause on failure',
    getValue: ({ describeSchedule }) =>
      describeSchedule.policies?.pauseOnFailure ? 'Yes' : 'No',
  },
  {
    key: 'bufferLimit',
    getLabel: () => 'Buffer limit',
    getValue: ({ describeSchedule }) =>
      formatScheduleLimitValue(describeSchedule.policies?.bufferLimit),
    hide: ({ describeSchedule }) =>
      describeSchedule.policies?.overlapPolicy !==
      ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
  },
  {
    key: 'concurrencyLimit',
    getLabel: () => 'Concurrency limit',
    getValue: ({ describeSchedule }) =>
      formatScheduleLimitValue(describeSchedule.policies?.concurrencyLimit),
    hide: ({ describeSchedule }) =>
      describeSchedule.policies?.overlapPolicy !==
      ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT,
  },
];

export default schedulePoliciesDetailsConfig;
