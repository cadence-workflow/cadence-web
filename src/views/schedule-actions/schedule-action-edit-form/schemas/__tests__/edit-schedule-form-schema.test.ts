import { mockEditScheduleFormData } from '../../__fixtures__/mock-edit-schedule-form-data';
import { editScheduleFormSchema } from '../edit-schedule-form-schema';

describe('editScheduleFormSchema', () => {
  it('accepts a fully prefilled edit form', () => {
    const result = editScheduleFormSchema.safeParse(mockEditScheduleFormData);

    expect(result.success).toBe(true);
  });

  it('requires a schedule id, unlike the create form', () => {
    const result = editScheduleFormSchema.safeParse({
      ...mockEditScheduleFormData,
      scheduleId: '',
    });

    expect(result.success).toBe(false);
    expect(result.error?.errors).toEqual([
      expect.objectContaining({
        path: ['scheduleId'],
        message: 'Schedule id is required',
      }),
    ]);
  });

  it('applies the shared create-schedule refinements', () => {
    const result = editScheduleFormSchema.safeParse({
      ...mockEditScheduleFormData,
      memo: 'not json',
    });

    expect(result.success).toBe(false);
    expect(result.error?.errors).toEqual([
      expect.objectContaining({
        path: ['memo'],
        message: 'Memo must be valid JSON',
      }),
    ]);
  });

  it('applies the shared create-schedule field validation', () => {
    const result = editScheduleFormSchema.safeParse({
      ...mockEditScheduleFormData,
      workflowType: { name: '' },
    });

    expect(result.success).toBe(false);
    expect(result.error?.errors).toEqual([
      expect.objectContaining({
        path: ['workflowType', 'name'],
        message: 'Workflow type is required',
      }),
    ]);
  });
});
