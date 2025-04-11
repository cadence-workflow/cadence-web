import { z } from 'zod';

export const resetWorkflowFormSchema = z.object({
  decisionFinishEventId: z.string().min(1),
  reason: z.string().min(1),
  skipSignalReapply: z.boolean().optional(),
});
