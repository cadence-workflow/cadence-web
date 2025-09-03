import { type ActiveClusterSelectionStrategy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActiveClusterSelectionStrategy';

export const ACTIVE_CLUSTER_SELECTION_STRATEGY_LABEL_MAP = {
  ACTIVE_CLUSTER_SELECTION_STRATEGY_INVALID: 'Invalid',
  ACTIVE_CLUSTER_SELECTION_STRATEGY_REGION_STICKY: 'Region Sticky',
  ACTIVE_CLUSTER_SELECTION_STRATEGY_EXTERNAL_ENTITY: 'External Entity',
} as const satisfies Record<ActiveClusterSelectionStrategy, string>;
