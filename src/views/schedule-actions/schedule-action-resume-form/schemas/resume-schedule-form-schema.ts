import { z } from 'zod';

import { SCHEDULE_CATCH_UP_POLICIES } from '@/route-handlers/create-schedule/create-schedule.constants';

import { USE_SCHEDULE_CATCH_UP_POLICY } from '../schedule-action-resume-form.constants';

export const resumeScheduleFormSchema = z.object({
  reason: z.string().trim().optional(),
  catchUpPolicy: z
    .union([
      z.literal(USE_SCHEDULE_CATCH_UP_POLICY),
      z.enum(SCHEDULE_CATCH_UP_POLICIES),
    ])
    .optional(),
});
