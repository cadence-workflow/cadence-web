import { z } from 'zod';

import { rpsSchema } from '@/views/domain-batch-actions/schemas/rps-schema';

export const editRpsFormSchema = z.object({
  rps: rpsSchema,
});

export type EditRpsFormData = z.infer<typeof editRpsFormSchema>;
