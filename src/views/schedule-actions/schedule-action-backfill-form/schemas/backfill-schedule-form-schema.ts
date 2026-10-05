import { z } from 'zod';

import { SCHEDULE_OVERLAP_POLICIES } from '@/route-handlers/create-schedule/create-schedule.constants';
import getSchedulePeriodError from '@/route-handlers/create-schedule/helpers/get-schedule-period-error';

import { USE_SCHEDULE_OVERLAP_POLICY } from '../schedule-action-backfill-form.constants';

export const backfillScheduleFormSchema = z
  .object({
    backfillId: z.string().trim().optional(),
    startTime: z
      .string({ required_error: 'Start date is required' })
      .min(1, 'Start date is required')
      .datetime('Start date is required'),
    endTime: z
      .string({ required_error: 'End date is required' })
      .min(1, 'End date is required')
      .datetime('End date is required'),
    overlapPolicy: z
      .union([
        z.literal(USE_SCHEDULE_OVERLAP_POLICY),
        z.enum(SCHEDULE_OVERLAP_POLICIES),
      ])
      .optional(),
  })
  .superRefine((data, ctx) => {
    const schedulePeriodError = getSchedulePeriodError(
      data.startTime,
      data.endTime
    );

    if (schedulePeriodError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: schedulePeriodError.message,
        path: ['startTime'],
      });
    }
  });
