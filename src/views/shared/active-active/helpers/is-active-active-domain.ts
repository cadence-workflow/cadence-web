import { type Domain } from '@/__generated__/proto-ts/uber/cadence/api/v1/Domain';

import { type ActiveActiveDomain } from '../active-active.types';

export default function isActiveActiveDomain(
  domain: Domain
): domain is ActiveActiveDomain {
  return Boolean(
    domain.activeClusters &&
      Object.entries(domain.activeClusters.regionToCluster).length > 0
  );
}
