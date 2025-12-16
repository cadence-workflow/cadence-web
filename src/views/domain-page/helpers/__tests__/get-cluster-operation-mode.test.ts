import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';

import {
  mockDomainDescription,
  mockDomainDescriptionSingleCluster,
} from '../../__fixtures__/domain-description';
import getClusterOperationMode from '../get-cluster-operation-mode';

jest.mock('@/views/shared/active-active/helpers/is-active-active-domain');

describe(getClusterOperationMode.name, () => {
  it('returns Active-Active when domain is active-active', () => {
    expect(getClusterOperationMode(mockActiveActiveDomain)).toBe(
      'Active-Active'
    );
  });

  it('returns Active-Passive when domain is global but not active-active', () => {
    expect(getClusterOperationMode(mockDomainDescription)).toBe(
      'Active-Passive'
    );
  });

  it('returns Local when domain is not global', () => {
    const nonGlobalDomain = {
      ...mockDomainDescriptionSingleCluster,
      isGlobalDomain: false,
    };

    expect(getClusterOperationMode(nonGlobalDomain)).toBe('Local');
  });
});
