import { z } from 'zod';

import { type Json } from '../start-workflow.types';

export const literalSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export const jsonValueSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonValueSchema), z.record(jsonValueSchema)])
);
