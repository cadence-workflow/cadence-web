import { z } from 'zod';

import formatPayload from '@/utils/data-formatters/format-payload';

const localActivityMarkerDetailsSchema = z
  .object({
    data: z.string(),
  })
  .transform((payload) => formatPayload(payload))
  .pipe(
    z.object({
      activityId: z.string(),
      activityType: z.string(),
      resultJson: z.string().transform((res, ctx) => {
        try {
          return JSON.parse(res);
        } catch {
          ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
          return z.NEVER;
        }
      }),
    })
  );

export default localActivityMarkerDetailsSchema;
