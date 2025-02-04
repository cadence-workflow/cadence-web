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
  WORKFLOW_ACTIONS_ENABLED: {
    args: z.object({
      cluster: z.string(),
      domain: z.string(),
    }),
    returnType: z.object({
      cancel: z.boolean(),
      terminate: z.boolean(),
    }),
  },
};

export default resolverSchemas;
