import { type Control, type FieldErrors } from 'react-hook-form';
import { type z } from 'zod';

import type batchActionParamsSchema from './schemas/batch-action-params-schema';

export type BatchActionParamsFormData = z.infer<typeof batchActionParamsSchema>;

export type Props = {
  control: Control<BatchActionParamsFormData>;
  fieldErrors: FieldErrors<BatchActionParamsFormData>;
};
