import { z } from 'zod';

const pauseScheduleRequestBodySchema = z.object({
  reason: z.string().optional(),
});

export default pauseScheduleRequestBodySchema;
