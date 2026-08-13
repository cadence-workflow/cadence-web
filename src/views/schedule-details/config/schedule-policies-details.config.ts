import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { type ScheduleDetailRowConfig } from '@/views/schedule-details/schedule-details.types';
import {
  SERVER_CATCH_UP_POLICY_DEFAULT,
  SERVER_OVERLAP_POLICY_DEFAULT,
  SCHEDULE_CATCH_UP_POLICY_LABELS,
  SCHEDULE_OVERLAP_POLICY_LABELS,
} from '@/views/shared/constants/schedule-policy-labels.constants';

import { formatScheduleEnumWithDefault } from '../helpers/format-schedule-enum-with-default';
import { formatScheduleLimitValue } from '../helpers/format-schedule-limit-value';

const schedulePoliciesDetailsConfig: ScheduleDetailRowConfig[] = [
  {
    key: 'overlapPolicy',
    getLabel: () => 'Overlap policy',
    getValue: ({ formattedScheduleDetails: { policies } }) =>
      formatScheduleEnumWithDefault(
        policies?.overlapPolicy,
        SCHEDULE_OVERLAP_POLICY_LABELS,
        SERVER_OVERLAP_POLICY_DEFAULT
      ),
  },
  {
    key: 'catchUpPolicy',
    getLabel: () => 'Catchup policy',
    getValue: ({ formattedScheduleDetails: { policies } }) =>
      formatScheduleEnumWithDefault(
        policies?.catchUpPolicy,
        SCHEDULE_CATCH_UP_POLICY_LABELS,
        SERVER_CATCH_UP_POLICY_DEFAULT
      ),
  },
  {
    key: 'pauseOnFailure',
    getLabel: () => 'Pause on failure',
    getValue: ({ formattedScheduleDetails: { policies } }) =>
      policies?.pauseOnFailure ? 'Yes' : 'No',
  },
  {
    key: 'bufferLimit',
    getLabel: () => 'Buffer limit',
    getValue: ({ formattedScheduleDetails: { policies } }) =>
      formatScheduleLimitValue(policies?.bufferLimit),
    hide: ({ formattedScheduleDetails: { policies } }) =>
      policies?.overlapPolicy !==
      ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
  },
  {
    key: 'concurrencyLimit',
    getLabel: () => 'Concurrency limit',
    getValue: ({ formattedScheduleDetails: { policies } }) =>
      formatScheduleLimitValue(policies?.concurrencyLimit),
    hide: ({ formattedScheduleDetails: { policies } }) =>
      policies?.overlapPolicy !==
      ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT,
  },
];

export default schedulePoliciesDetailsConfig;
