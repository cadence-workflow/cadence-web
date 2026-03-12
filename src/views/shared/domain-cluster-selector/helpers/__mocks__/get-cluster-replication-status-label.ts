import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

import { type DomainDescription } from '../../domain-page.types';

// Manual mock for getClusterReplicationStatusLabel
export default function getClusterReplicationStatusLabel(
  domain: DomainDescription,
  cluster: string
): string | undefined {
  if (isActiveActiveDomain(domain)) {
    return cluster === domain.activeClusterName ? 'primary' : undefined;
  }

  return cluster === domain.activeClusterName ? 'active' : 'passive';
}
