import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';

import {
  mockDomainDescription,
  mockDomainDescriptionSingleCluster,
} from '../../__fixtures__/domain-description';
import getClusterReplicationStatusLabel from '../get-cluster-replication-status-label';

jest.mock('@/views/shared/active-active/helpers/is-active-active-domain');

describe(getClusterReplicationStatusLabel.name, () => {
  it('returns "active" for the active cluster in Active-Passive domains', () => {
    expect(
      getClusterReplicationStatusLabel(
        mockDomainDescription,
        mockDomainDescription.activeClusterName
      )
    ).toBe('active');
  });

  it('returns "passive" for non-active clusters in Active-Passive domains', () => {
    expect(
      getClusterReplicationStatusLabel(mockDomainDescription, 'cluster_2')
    ).toBe('passive');
  });

  it('returns "active" for single cluster domain', () => {
    expect(
      getClusterReplicationStatusLabel(
        mockDomainDescriptionSingleCluster,
        mockDomainDescriptionSingleCluster.activeClusterName
      )
    ).toBe('active');
  });

  it('returns "primary" for the active cluster in Active-Active domains', () => {
    expect(
      getClusterReplicationStatusLabel(
        mockActiveActiveDomain,
        mockActiveActiveDomain.activeClusterName
      )
    ).toBe('primary');
  });

  it('returns undefined for non-primary clusters in Active-Active domains', () => {
    expect(
      getClusterReplicationStatusLabel(mockActiveActiveDomain, 'cluster1')
    ).toBeUndefined();
  });
});
