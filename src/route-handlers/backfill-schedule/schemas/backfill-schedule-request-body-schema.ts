import { z } from 'zod';

import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import getSchedulePeriodError from '@/route-handlers/create-schedule/helpers/get-schedule-period-error';

export const backfillScheduleRequestBodySchema = z
  .object({
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    overlapPolicy: z.nativeEnum(ScheduleOverlapPolicy).optional(),
    backfillId: z.string().optional(),
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
        path: ['endTime'],
      });
    }
  });

export default backfillScheduleRequestBodySchema;
