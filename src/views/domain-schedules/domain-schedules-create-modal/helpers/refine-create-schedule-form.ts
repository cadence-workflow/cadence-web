import { z } from 'zod';

import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import getSchedulePeriodError from '@/route-handlers/create-schedule/helpers/get-schedule-period-error';

import { type CreateScheduleFormRefineInput } from '../domain-schedules-create-modal.types';

export default function refineCreateScheduleForm(
  data: CreateScheduleFormRefineInput,
  ctx: z.RefinementCtx
) {
  if (
    data.overlapPolicy ===
      ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER &&
    data.bufferLimit !== '' &&
    data.bufferLimit !== undefined &&
    !(
      Number.isInteger(Number(data.bufferLimit)) &&
      Number(data.bufferLimit) >= 0
    )
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Buffer limit must be a non-negative integer',
      path: ['bufferLimit'],
    });
  }

  if (
    data.overlapPolicy ===
      ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT &&
    data.concurrencyLimit !== '' &&
    data.concurrencyLimit !== undefined &&
    !(
      Number.isInteger(Number(data.concurrencyLimit)) &&
      Number(data.concurrencyLimit) >= 0
    )
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Concurrency limit must be a non-negative integer',
      path: ['concurrencyLimit'],
    });
  }

  if (
    data.catchUpPolicy !== undefined &&
    data.catchUpPolicy !==
      ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP &&
    (data.catchUpWindowDays === '' || data.catchUpWindowDays === undefined)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Catch-up window is required',
      path: ['catchUpWindowDays'],
    });
  }

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
}
