import { type ActiveActiveDomain } from '../active-active.types';

export default function getDefaultClusterForActiveActiveDomain(
  domain: ActiveActiveDomain
): string {
  return Object.values(domain.activeClusters.regionToCluster).reduce<string>(
    (defaultClusterName, c) =>
      !defaultClusterName || c.activeClusterName < defaultClusterName
        ? c.activeClusterName
        : defaultClusterName,
    ''
  );
}
