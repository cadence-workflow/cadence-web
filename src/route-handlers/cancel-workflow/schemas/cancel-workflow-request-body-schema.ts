import { z } from 'zod';

const cancelWorkflowRequestBodySchema = z.object({
  cause: z
    .string()
    .optional()
    .default('Requesting workflow cancellation from cadence-web UI'),
});

export default cancelWorkflowRequestBodySchema;
