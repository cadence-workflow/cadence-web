import { type FailoverEvent } from '@/route-handlers/list-failover-history/list-failover-history.types';

export type ClusterFailover = FailoverEvent['clusterFailovers'][number];
