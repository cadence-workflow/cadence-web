import { z } from 'zod';

const batchActionParamsSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  rps: z
    .number()
    .int()
    .min(1, 'Must be between 1 and 999')
    .max(999, 'Must be between 1 and 999'),
});

export default batchActionParamsSchema;

export type BatchActionParamsFormData = z.infer<typeof batchActionParamsSchema>;
