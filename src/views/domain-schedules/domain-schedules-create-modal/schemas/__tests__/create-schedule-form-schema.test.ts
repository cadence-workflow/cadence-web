import { mockDomainSchedulesCreateFormData } from '../../__fixtures__/mock-domain-schedules-create-form-data';
import { createScheduleFormSchema } from '../create-schedule-form-schema';

describe('createScheduleFormSchema', () => {
  it('accepts schedule period when only start or end is provided', () => {
    expect(
      createScheduleFormSchema.safeParse({
        ...mockDomainSchedulesCreateFormData,
        startTime: '2026-06-23T12:00:00.000Z',
      }).success
    ).toBe(true);

    expect(
      createScheduleFormSchema.safeParse({
        ...mockDomainSchedulesCreateFormData,
        endTime: '2026-06-30T12:00:00.000Z',
      }).success
    ).toBe(true);
  });

  it('accepts schedule period when start is before end', () => {
    expect(
      createScheduleFormSchema.safeParse({
        ...mockDomainSchedulesCreateFormData,
        startTime: '2026-06-23T12:00:00.000Z',
        endTime: '2026-06-30T12:00:00.000Z',
      }).success
    ).toBe(true);
  });

  it('rejects schedule period when start is not before end', () => {
    const result = createScheduleFormSchema.safeParse({
      ...mockDomainSchedulesCreateFormData,
      startTime: '2026-06-30T12:00:00.000Z',
      endTime: '2026-06-23T12:00:00.000Z',
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ['startTime'],
          message: 'Start date must be before end date',
        }),
      ])
    );
  });
});
