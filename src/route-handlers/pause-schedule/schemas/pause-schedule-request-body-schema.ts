import { z } from 'zod';

const pauseScheduleRequestBodySchema = z.object({
  reason: z.string().min(1),
});

export default pauseScheduleRequestBodySchema;
