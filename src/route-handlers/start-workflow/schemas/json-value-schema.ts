import { z } from 'zod';

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonValueSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonValueSchema), z.record(jsonValueSchema)])
);

export default jsonValueSchema;
