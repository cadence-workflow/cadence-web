import { z } from 'zod';

export const pauseScheduleFormSchema = z.object({
  reason: z.string().trim().min(1, 'Reason for pausing is required'),
});
