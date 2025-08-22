import { type ActiveActiveDomain } from '../active-active.types';

export default function getDefaultClusterForActiveActiveDomain(
  domain: ActiveActiveDomain
): string {
  return Object.values(domain.activeClusters.regionToCluster).reduce<string>(
    (defaultClusterName, c) =>
      c.activeClusterName < defaultClusterName
        ? c.activeClusterName
        : defaultClusterName,
    ''
  );
}
