import { type z } from 'zod';

import { type cadenceJwtClaimsSchema } from './schemas/cadence-jwt-claims-schema';

export type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

export type CadenceJwtClaims = z.infer<typeof cadenceJwtClaimsSchema>;
