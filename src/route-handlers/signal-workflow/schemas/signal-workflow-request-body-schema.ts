import { z } from 'zod';

import signalWorkflowInputSchema from './signal-workflow-input-schema';

const signalWorkflowRequestBodySchema = z.object({
  signalName: z.string().min(1),
  signalInput: signalWorkflowInputSchema.optional(),
});

export default signalWorkflowRequestBodySchema;
