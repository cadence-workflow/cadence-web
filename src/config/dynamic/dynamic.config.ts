import 'server-only';

import type {
  ConfigAsyncResolverDefinition,
  ConfigEnvDefinition,
  ConfigSyncResolverDefinition,
} from '../../utils/config/config.types';

import clusters from './resolvers/clusters';
import clustersPublic from './resolvers/clusters-public';
import { type PublicClustersConfigs } from './resolvers/clusters-public.types';
import { type ClustersConfigs } from './resolvers/clusters.types';
import workflowActionsEnabled from './resolvers/workflow-actions-enabled';
import {
  type WorkflowActionsEnabledResolverParams,
  type WorkflowActionsEnabledConfig,
} from './resolvers/workflow-actions-enabled.types';

const dynamicConfigs: {
  CADENCE_WEB_PORT: ConfigEnvDefinition;
  ADMIN_SECURITY_TOKEN: ConfigEnvDefinition;
  CLUSTERS: ConfigSyncResolverDefinition<
    undefined,
    ClustersConfigs,
    'serverStart'
  >;
  CLUSTERS_PUBLIC: ConfigSyncResolverDefinition<
    undefined,
    PublicClustersConfigs,
    'serverStart',
    true
  >;
  WORKFLOW_ACTIONS_ENABLED: ConfigAsyncResolverDefinition<
    WorkflowActionsEnabledResolverParams,
    WorkflowActionsEnabledConfig,
    'request',
    true
  >;
} = {
  CADENCE_WEB_PORT: {
    env: 'CADENCE_WEB_PORT',
    // Fallback to nextjs default port if CADENCE_WEB_PORT is not provided
    default: '3000',
  },
  ADMIN_SECURITY_TOKEN: {
    env: 'CADENCE_ADMIN_SECURITY_TOKEN',
    default: '',
  },
  CLUSTERS: {
    resolver: clusters,
    evaluateOn: 'serverStart',
  },
  CLUSTERS_PUBLIC: {
    resolver: clustersPublic,
    evaluateOn: 'serverStart',
    isPublic: true,
  },
  WORKFLOW_ACTIONS_ENABLED: {
    resolver: workflowActionsEnabled,
    evaluateOn: 'request',
    isPublic: true,
  },
} as const;

export default dynamicConfigs;
