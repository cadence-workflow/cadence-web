import { z } from 'zod';

export default function validateArchivedQueryParams(
  queryParams: {
    listType: string;
    inputType: string;
    timeColumn: string;
    timeRangeStart?: string;
    timeRangeEnd?: string;
  },
  ctx: z.RefinementCtx
) {
  if (
    queryParams.listType === 'archived' &&
    queryParams.inputType === 'search'
  ) {
    if (queryParams.timeColumn === 'StartTime') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cannot search for archived workflows by start time',
      });
    }

    if (!queryParams.timeRangeStart || !queryParams.timeRangeEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Start and End time need to be passed for searching archived workflows',
      });
    }
  }
}
