import { z } from 'zod';

import { type ResolverSchemas } from '../../../../utils/config/config.types';
import WORKFLOW_ACTIONS_DISABLED_VALUES_CONFIG from '../workflow-actions-disabled-values.config';

const workflowActionsEnabledValueSchema = z.enum([
  'ENABLED',
  ...WORKFLOW_ACTIONS_DISABLED_VALUES_CONFIG,
]);

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
      cancel: workflowActionsEnabledValueSchema,
      terminate: workflowActionsEnabledValueSchema,
      restart: workflowActionsEnabledValueSchema,
    }),
  },
};

export default resolverSchemas;
