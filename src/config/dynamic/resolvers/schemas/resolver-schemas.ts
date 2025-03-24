import { z } from 'zod';

import { type ResolverSchemas } from '../../../../utils/config/config.types';
import {
  WORKFLOW_ACTIONS_DISABLED_REASONS,
  WORKFLOW_ACTIONS_ENABLED_CONFIG_VALUES,
} from '../workflow-actions-enabled.constants';

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
      cancel: z.enum([
        WORKFLOW_ACTIONS_ENABLED_CONFIG_VALUES.enabled,
        ...WORKFLOW_ACTIONS_DISABLED_REASONS,
      ]),
      terminate: z.enum([
        WORKFLOW_ACTIONS_ENABLED_CONFIG_VALUES.enabled,
        ...WORKFLOW_ACTIONS_DISABLED_REASONS,
      ]),
      restart: z.enum([
        WORKFLOW_ACTIONS_ENABLED_CONFIG_VALUES.enabled,
        ...WORKFLOW_ACTIONS_DISABLED_REASONS,
      ]),
    }),
  },
};

export default resolverSchemas;
