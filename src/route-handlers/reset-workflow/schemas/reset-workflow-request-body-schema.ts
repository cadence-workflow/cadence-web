import { z } from 'zod';

const resetWorkflowRequestBodySchema = z.object({
  reason: z
    .string()
    .optional()
    .default('Resetting workflow from cadence-web UI'),
  decisionFinishEventId: z.union([z.string(), z.number()]),
  requestId: z.string().optional(),
  skipSignalReapply: z.boolean().optional(),
});

export default resetWorkflowRequestBodySchema;
