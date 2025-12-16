import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

import { DEFAULT_CLUSTER_SCOPE } from '../domain-page-failovers/domain-page-failovers.constants';
import { type DomainDescription } from '../domain-page.types';

export default function getClusterReplicationStatusLabel(
  domain: DomainDescription,
  cluster: string
): string | undefined {
  if (isActiveActiveDomain(domain)) {
    return cluster === domain.activeClusterName
      ? DEFAULT_CLUSTER_SCOPE
      : undefined;
  }

  return cluster === domain.activeClusterName ? 'active' : 'passive';
}
