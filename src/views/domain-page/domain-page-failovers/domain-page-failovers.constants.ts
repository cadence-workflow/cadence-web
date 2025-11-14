import { type FailoverEvent } from '@/route-handlers/list-failover-history/list-failover-history.types';

export const PRIMARY_CLUSTER_SCOPE = 'primary';

export const FAILOVER_TYPE_LABEL_MAP: Record<
  FailoverEvent['failoverType'],
  string
> = {
  FAILOVER_TYPE_INVALID: 'Invalid',
  FAILOVER_TYPE_FORCE: 'Force',
  FAILOVER_TYPE_GRACEFUL: 'Graceful',
};
