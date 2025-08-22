import { type ActiveClusters } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActiveClusters';
import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';

export type ActiveActiveDomain = Domain & {
  activeClusters: ActiveClusters;
};
