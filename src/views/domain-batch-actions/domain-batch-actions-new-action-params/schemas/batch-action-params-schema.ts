import { z } from 'zod';

import { rpsSchema } from '@/views/domain-batch-actions/schemas/rps-schema';

const batchActionParamsSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  rps: rpsSchema,
});

export default batchActionParamsSchema;

export type BatchActionParamsFormData = z.infer<typeof batchActionParamsSchema>;
