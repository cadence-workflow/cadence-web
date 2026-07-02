import { backfillScheduleFormSchema } from '../backfill-schedule-form-schema';

describe(backfillScheduleFormSchema.name, () => {
  it('attributes schedule period error to startTime', () => {
    const result = backfillScheduleFormSchema.safeParse({
      startTime: '2026-06-02T12:00:00.000Z',
      endTime: '2026-06-01T12:00:00.000Z',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual([
        expect.objectContaining({
          path: ['startTime'],
          message: 'Start date must be before end date',
        }),
      ]);
    }
  });
});
