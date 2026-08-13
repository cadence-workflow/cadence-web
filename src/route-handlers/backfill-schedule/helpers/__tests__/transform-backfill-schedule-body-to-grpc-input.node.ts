import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';

import transformBackfillScheduleBodyToGrpcInput from '../transform-backfill-schedule-body-to-grpc-input';

describe(transformBackfillScheduleBodyToGrpcInput.name, () => {
  it('transforms ISO strings to gRPC timestamps', () => {
    expect(
      transformBackfillScheduleBodyToGrpcInput({
        domain: 'test-domain',
        scheduleId: 'test-schedule',
        body: {
          startTime: '2026-01-01T00:00:00.000Z',
          endTime: '2026-01-02T00:00:00.000Z',
        },
      })
    ).toEqual({
      domain: 'test-domain',
      scheduleId: 'test-schedule',
      startTime: { seconds: 1_767_225_600, nanos: 0 },
      endTime: { seconds: 1_767_312_000, nanos: 0 },
      overlapPolicy: undefined,
      backfillId: undefined,
    });
  });

  it('passes optional overlapPolicy and backfillId', () => {
    expect(
      transformBackfillScheduleBodyToGrpcInput({
        domain: 'test-domain',
        scheduleId: 'test-schedule',
        body: {
          startTime: '2026-01-01T00:00:00.000Z',
          endTime: '2026-01-02T00:00:00.000Z',
          overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
          backfillId: 'backfill-123',
        },
      })
    ).toEqual(
      expect.objectContaining({
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        backfillId: 'backfill-123',
      })
    );
  });
});
