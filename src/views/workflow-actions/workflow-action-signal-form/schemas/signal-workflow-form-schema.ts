import { z } from 'zod';

import signalWorkflowInputSchema from '@/route-handlers/signal-workflow/schemas/signal-workflow-input-schema';

export const signalWorkflowFormSchema = z.object({
  signalName: z.string().min(1),
  signalInput: signalWorkflowInputSchema.optional(),
});
