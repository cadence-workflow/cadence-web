import React from 'react';

import { render, screen, fireEvent, act, within } from '@/test-utils/rtl';

import {
  mockDomainDescription,
  mockDomainDescriptionSingleCluster,
} from '../../__fixtures__/domain-description';
import { type DomainDescription } from '../../domain-page.types';
import DomainPageClusterSelector from '../domain-page-cluster-selector';

const mockPushFn = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: mockPushFn,
    back: () => {},
    replace: () => {},
    forward: () => {},
    prefetch: () => {},
    refresh: () => {},
  }),
  useParams: () => ({
    domain: 'mock-domain',
    cluster: 'cluster_1',
    domainTab: 'workflows',
  }),
}));

describe(DomainPageClusterSelector.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render current cluster correctly', () => {
    setup({ domainDescription: mockDomainDescription });

    expect(screen.getByText('cluster_1')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('Should render only a label for single cluster', () => {
    setup({ domainDescription: mockDomainDescriptionSingleCluster });

    expect(screen.getByText('cluster_1')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('Should show available clusters and redirect when one is selected', () => {
    setup({ domainDescription: mockDomainDescription });

    expect(screen.getByText('cluster_1')).toBeInTheDocument();
    const clusterSelect = screen.getByRole('combobox');

    act(() => {
      fireEvent.click(clusterSelect);
    });

    const clustersMenu = screen.getByRole('listbox');
    const cluster2option = within(clustersMenu).getByText('cluster_2');

    act(() => {
      fireEvent.click(cluster2option);
    });

    expect(mockPushFn).toHaveBeenCalledWith(
      '/domains/mock-domain/cluster_2/workflows'
    );
  });
});

function setup({
  domainDescription,
}: {
  domainDescription: DomainDescription;
}) {
  render(
    <DomainPageClusterSelector
      cluster="cluster_1"
      domainDescription={domainDescription}
    />
  );
}
