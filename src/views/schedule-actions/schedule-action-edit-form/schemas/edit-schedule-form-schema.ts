import { z } from 'zod';

import refineCreateScheduleForm from '@/views/domain-schedules/domain-schedules-create-modal/helpers/refine-create-schedule-form';
import { createScheduleFormFieldsSchema } from '@/views/domain-schedules/domain-schedules-create-modal/schemas/create-schedule-form-schema';

/**
 * Editing validates exactly like creating, except the schedule id is always
 * known: it is prefilled from the existing schedule and shown read-only.
 */
export const editScheduleFormSchema = createScheduleFormFieldsSchema
  .extend({ scheduleId: z.string().min(1, 'Schedule id is required') })
  .superRefine(refineCreateScheduleForm);
