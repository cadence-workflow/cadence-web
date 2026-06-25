import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';

import { formatScheduleEnumWithDefault } from '../format-schedule-enum-with-default';

describe(formatScheduleEnumWithDefault.name, () => {
  it('returns formatted value when set', () => {
    expect(
      formatScheduleEnumWithDefault(
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        'SCHEDULE_OVERLAP_POLICY',
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW
      )
    ).toBe('Buffer');
  });

  it('returns default label when value is unset or invalid', () => {
    expect(
      formatScheduleEnumWithDefault(
        undefined,
        'SCHEDULE_OVERLAP_POLICY',
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW
      )
    ).toBe('Default (SkipNew)');
    expect(
      formatScheduleEnumWithDefault(
        'SCHEDULE_OVERLAP_POLICY_INVALID',
        'SCHEDULE_OVERLAP_POLICY',
        ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW
      )
    ).toBe('Default (SkipNew)');
  });
});
