import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';

import {
  DEFAULT_BACKFILL_OVERLAP_POLICY,
  USE_SCHEDULE_OVERLAP_POLICY,
} from '../../schedule-action-backfill-form.constants';
import transformBackfillScheduleFormToSubmission from '../transform-backfill-schedule-form-to-submission';

describe(transformBackfillScheduleFormToSubmission.name, () => {
  it('returns start and end times', () => {
    expect(
      transformBackfillScheduleFormToSubmission({
        startTime: '2026-01-01T00:00:00.000Z',
        endTime: '2026-01-02T00:00:00.000Z',
        overlapPolicy: DEFAULT_BACKFILL_OVERLAP_POLICY,
      })
    ).toEqual({
      startTime: '2026-01-01T00:00:00.000Z',
      endTime: '2026-01-02T00:00:00.000Z',
    });
  });

  it('includes overlapPolicy when explicitly selected', () => {
    expect(
      transformBackfillScheduleFormToSubmission({
        startTime: '2026-01-01T00:00:00.000Z',
        endTime: '2026-01-02T00:00:00.000Z',
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
      })
    ).toEqual({
      startTime: '2026-01-01T00:00:00.000Z',
      endTime: '2026-01-02T00:00:00.000Z',
      overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
    });
  });

  it('omits overlapPolicy for schedule default sentinel', () => {
    expect(
      transformBackfillScheduleFormToSubmission({
        startTime: '2026-01-01T00:00:00.000Z',
        endTime: '2026-01-02T00:00:00.000Z',
        overlapPolicy: USE_SCHEDULE_OVERLAP_POLICY,
      })
    ).toEqual({
      startTime: '2026-01-01T00:00:00.000Z',
      endTime: '2026-01-02T00:00:00.000Z',
    });
  });
});
