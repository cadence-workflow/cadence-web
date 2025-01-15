import { z } from 'zod';

const terminateWorkflowRequestBodySchema = z.object({
  reason: z
    .string()
    .optional()
    .default('Terminating workflow from cadence-web UI'),
});

export default terminateWorkflowRequestBodySchema;
