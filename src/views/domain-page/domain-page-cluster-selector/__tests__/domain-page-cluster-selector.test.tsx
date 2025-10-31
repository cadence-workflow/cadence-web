import React from 'react';

import { render, screen, fireEvent, act, within } from '@/test-utils/rtl';

import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';

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

jest.mock('../../helpers/get-cluster-replication-status-label');

describe(DomainPageClusterSelector.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render current cluster correctly', () => {
    setup({ domainDescription: mockDomainDescription });

    expect(screen.getByText('cluster_1 (active)')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('Should render only a label for single cluster', () => {
    setup({ domainDescription: mockDomainDescriptionSingleCluster });

    expect(screen.getByText('cluster_1')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('Should show available clusters and redirect when one is selected', () => {
    setup({ domainDescription: mockDomainDescription });

    expect(screen.getByText('cluster_1 (active)')).toBeInTheDocument();
    const clusterSelect = screen.getByRole('combobox');

    act(() => {
      fireEvent.click(clusterSelect);
    });

    const clustersMenu = screen.getByRole('listbox');
    const cluster2option = within(clustersMenu).getByText(
      'cluster_2 (passive)'
    );

    act(() => {
      fireEvent.click(cluster2option);
    });

    expect(mockPushFn).toHaveBeenCalledWith(
      '/domains/mock-domain/cluster_2/workflows'
    );
  });

  it('Should show active/passive labels for active-passive domains', () => {
    setup({ domainDescription: mockDomainDescription });

    const clusterSelect = screen.getByRole('combobox');

    act(() => {
      fireEvent.click(clusterSelect);
    });

    const clustersMenu = screen.getByRole('listbox');

    expect(
      within(clustersMenu).getByText('cluster_1 (active)')
    ).toBeInTheDocument();
    expect(
      within(clustersMenu).getByText('cluster_2 (passive)')
    ).toBeInTheDocument();
  });

  it('Should show primary label only for active cluster in active-active domains', () => {
    setup({ domainDescription: mockActiveActiveDomain, cluster: 'cluster0' });

    const clusterSelect = screen.getByRole('combobox');

    act(() => {
      fireEvent.click(clusterSelect);
    });

    const clustersMenu = screen.getByRole('listbox');

    expect(
      within(clustersMenu).getByText('cluster0 (primary)')
    ).toBeInTheDocument();
    expect(within(clustersMenu).getByText('cluster1')).toBeInTheDocument();
  });
});

function setup({
  domainDescription,
  cluster = 'cluster_1',
}: {
  domainDescription: DomainDescription;
  cluster?: string;
}) {
  render(
    <DomainPageClusterSelector
      cluster={cluster}
      domainDescription={domainDescription}
    />
  );
}
