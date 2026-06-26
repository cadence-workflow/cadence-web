import { z } from 'zod';

const pauseScheduleRequestBodySchema = z.object({
  reason: z.string(),
});

export default pauseScheduleRequestBodySchema;
