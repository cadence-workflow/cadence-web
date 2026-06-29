import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';

import { formatScheduleEnumWithDefault } from '../format-schedule-enum-with-default';

const mockOverlapPolicyLabels: Record<string, string> = {
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW]: 'Skip',
  [ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER]: 'Buffer',
};

const mockCatchUpPolicyLabels: Record<string, string> = {
  [ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP]: 'Skip',
  [ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE]: 'Catch-up one',
};

describe(formatScheduleEnumWithDefault.name, () => {
  it('returns curated label when value is set', () => {
    expect(
      formatScheduleEnumWithDefault(
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        mockOverlapPolicyLabels,
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW
      )
    ).toBe('Buffer');
    expect(
      formatScheduleEnumWithDefault(
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW,
        mockOverlapPolicyLabels,
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW
      )
    ).toBe('Skip');
    expect(
      formatScheduleEnumWithDefault(
        ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE,
        mockCatchUpPolicyLabels,
        ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP
      )
    ).toBe('Catch-up one');
  });

  it('returns default label when value is unset or invalid', () => {
    expect(
      formatScheduleEnumWithDefault(
        undefined,
        mockOverlapPolicyLabels,
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW
      )
    ).toBe('Default (Skip)');
    expect(
      formatScheduleEnumWithDefault(
        'SCHEDULE_OVERLAP_POLICY_INVALID',
        mockOverlapPolicyLabels,
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW
      )
    ).toBe('Default (Skip)');
  });
});
