import { type ActiveActiveDomain } from '../../active-active.types';

export default function getDefaultClusterForActiveActiveDomain(
  domain: ActiveActiveDomain
) {
  return Object.values(domain.activeClusters.regionToCluster)[0]
    .activeClusterName;
}
