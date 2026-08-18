import { createDomainSchedulesCreateFormData } from '@/views/domain-schedules/domain-schedules-create-modal/__fixtures__/mock-domain-schedules-create-form-data';

import { editScheduleFormSchema } from '../edit-schedule-form-schema';

describe('editScheduleFormSchema', () => {
  it('rejects search attribute values that are not string, number or boolean', () => {
    const result = editScheduleFormSchema.safeParse({
      ...createDomainSchedulesCreateFormData({ scheduleId: 'schedule-id' }),
      searchAttributes: [{ key: 'CustomListField', value: ['a', 'b'] }],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['searchAttributes', 0, 'value'] }),
      ])
    );
  });
});
