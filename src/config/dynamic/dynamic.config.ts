import 'server-only';

import type {
  ConfigAsyncResolverDefinition,
  ConfigEnvDefinition,
  ConfigSyncResolverDefinition,
} from '../../utils/config/config.types';

import archivalDefaultSearchEnabled from './resolvers/archival-default-search-enabled';
import clusters from './resolvers/clusters';
import clustersPublic from './resolvers/clusters-public';
import { type PublicClustersConfigs } from './resolvers/clusters-public.types';
import { type ClustersConfigs } from './resolvers/clusters.types';
import cronListEnabled from './resolvers/cron-list-enabled';
import { type CronListEnabledResolverParams } from './resolvers/cron-list-enabled.types';
import extendedDomainInfoEnabled from './resolvers/extended-domain-info-enabled';
import { type ExtendedDomainInfoEnabledConfig } from './resolvers/extended-domain-info-enabled.types';
import failoverHistoryEnabled from './resolvers/failover-history-enabled';
import historyPageV2Enabled from './resolvers/history-page-v2-enabled';
import workflowActionsEnabled from './resolvers/workflow-actions-enabled';
import {
  type WorkflowActionsEnabledResolverParams,
  type WorkflowActionsEnabledConfig,
} from './resolvers/workflow-actions-enabled.types';
import workflowDiagnosticsEnabled from './resolvers/workflow-diagnostics-enabled';

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
  CRON_LIST_ENABLED: ConfigAsyncResolverDefinition<
    CronListEnabledResolverParams,
    boolean,
    'request',
    true
  >;
  WORKFLOW_ACTIONS_ENABLED: ConfigAsyncResolverDefinition<
    WorkflowActionsEnabledResolverParams,
    WorkflowActionsEnabledConfig,
    'request',
    true
  >;
  EXTENDED_DOMAIN_INFO_ENABLED: ConfigAsyncResolverDefinition<
    undefined,
    ExtendedDomainInfoEnabledConfig,
    'request',
    true
  >;
  WORKFLOW_DIAGNOSTICS_ENABLED: ConfigAsyncResolverDefinition<
    undefined,
    boolean,
    'request',
    true
  >;
  ARCHIVAL_DEFAULT_SEARCH_ENABLED: ConfigAsyncResolverDefinition<
    undefined,
    boolean,
    'request',
    true
  >;
  FAILOVER_HISTORY_ENABLED: ConfigAsyncResolverDefinition<
    undefined,
    boolean,
    'request',
    true
  >;
  HISTORY_PAGE_V2_ENABLED: ConfigAsyncResolverDefinition<
    undefined,
    boolean,
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
  CRON_LIST_ENABLED: {
    resolver: cronListEnabled,
    evaluateOn: 'request',
    isPublic: true,
  },
  WORKFLOW_ACTIONS_ENABLED: {
    resolver: workflowActionsEnabled,
    evaluateOn: 'request',
    isPublic: true,
  },
  EXTENDED_DOMAIN_INFO_ENABLED: {
    resolver: extendedDomainInfoEnabled,
    evaluateOn: 'request',
    isPublic: true,
  },
  WORKFLOW_DIAGNOSTICS_ENABLED: {
    resolver: workflowDiagnosticsEnabled,
    evaluateOn: 'request',
    isPublic: true,
  },
  ARCHIVAL_DEFAULT_SEARCH_ENABLED: {
    resolver: archivalDefaultSearchEnabled,
    evaluateOn: 'request',
    isPublic: true,
  },
  FAILOVER_HISTORY_ENABLED: {
    resolver: failoverHistoryEnabled,
    evaluateOn: 'request',
    isPublic: true,
  },
  HISTORY_PAGE_V2_ENABLED: {
    resolver: historyPageV2Enabled,
    evaluateOn: 'request',
    isPublic: true,
  },
} as const;

export default dynamicConfigs;
