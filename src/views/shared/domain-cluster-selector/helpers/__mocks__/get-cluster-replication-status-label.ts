import type { DomainDescription } from '@/views/domain-page/domain-page.types';
import isActiveActiveDomain from '@/views/shared/active-active/helpers/is-active-active-domain';

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
