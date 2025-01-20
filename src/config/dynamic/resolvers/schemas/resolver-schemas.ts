import { z } from 'zod';

import { type ResolverSchemas } from '../../../../utils/config/config.types';

// Example usage:
const resolverSchemas: ResolverSchemas = {
  COMPUTED: {
    args: z.undefined(),
    returnType: z.tuple([z.string()]),
  },
  COMPUTED_WITH_ARG: {
    args: z.tuple([z.string()]),
    returnType: z.tuple([z.string()]),
  },
  DYNAMIC: {
    args: z.undefined(),
    returnType: z.number(),
  },
  DYNAMIC_WITH_ARG: {
    args: z.number(),
    returnType: z.number(),
  },
};

export default resolverSchemas;
