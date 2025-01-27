import { z } from 'zod';

import { type ResolverSchemas } from '../../../../utils/config/config.types';

const resolverSchemas: ResolverSchemas = {
  CLUSTERS: {
    args: z.undefined(),
    returnType: z.array(
      z.object({
        clusterName: z.string(),
        grpc: z.object({
          serviceName: z.string(),
          metadata: z.record(z.string(), z.string()).optional(),
          peer: z.string(),
        }),
      })
    ),
  },
  CLUSTERS_PUBLIC: {
    args: z.undefined(),
    returnType: z.array(
      z.object({
        clusterName: z.string(),
      })
    ),
  },
};

export default resolverSchemas;
