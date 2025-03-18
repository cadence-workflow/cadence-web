import { z } from 'zod';

const restartWorkflowRequestBodySchema = z.object({
  reason: z
    .string()
    .optional()
    .default('Restarting workflow from cadence-web UI'),
});

export default restartWorkflowRequestBodySchema;
