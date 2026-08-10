import { z } from 'zod';

export const cadenceJwtClaimsSchema = z
  .object({
    admin: z.boolean().optional(),
    exp: z.number().optional(),
    groups: z.string().optional(),
    name: z.string().trim().min(1).optional(),
    sub: z.string().trim().min(1).optional(),
  })
  .refine((claims) => claims.sub !== undefined || claims.name !== undefined, {
    message: 'JWT claims must include sub or name',
  });
