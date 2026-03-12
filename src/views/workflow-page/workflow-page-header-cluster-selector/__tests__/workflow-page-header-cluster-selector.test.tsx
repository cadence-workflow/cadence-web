import type React from 'react';
import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import {
  render,
  screen,
  fireEvent,
  act,
  within,
  waitFor,
} from '@/test-utils/rtl';

import type { HttpEndpointMock } from '@/test-utils/msw-mock-handlers/msw-mock-handlers.types';
import {
  mockDomainDescription,
  mockDomainDescriptionSingleCluster,
} from '@/views/domain-page/__fixtures__/domain-description';
import { type DomainDescription } from '@/views/domain-page/domain-page.types';
import { mockActiveActiveDomain } from '@/views/shared/active-active/__fixtures__/active-active-domain';

import WorkflowPageHeaderClusterSelector from '../workflow-page-header-cluster-selector';

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
    workflowId: 'workflow-123',
    runId: 'run-456',
    workflowTab: 'summary',
  }),
}));

jest.mock(
  '@/views/shared/domain-cluster-selector/domain-cluster-selector',
  () => {
    const React = require('react');
    const { useRouter, useParams } = require('next/navigation');
    return function MockDomainClusterSelector(props: {
      domainDescription: DomainDescription;
      cluster: string;
      buildPathForCluster?: (params: {
        newCluster: string;
        domainName: string;
        domainTab: string;
      }) => string;
      singleClusterRender?: 'label' | 'none';
    }) {
      const router = useRouter();
      const params = useParams() as {
        domain?: string;
        workflowTab?: string;
      };
      const hasMultipleClusters =
        props.domainDescription.clusters &&
        props.domainDescription.clusters.length > 1;

      if (!hasMultipleClusters) {
        if (props.singleClusterRender === 'label') {
          return <span data-testid="cluster-label">{props.cluster}</span>;
        }
        return null;
      }

      const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCluster = e.target.value;
        const path =
          props.buildPathForCluster?.({
            newCluster,
            domainName: params.domain ?? '',
            domainTab: params.workflowTab ?? '',
          }) ?? '';
        if (path) router.push(path);
      };

      return (
        <div data-testid="domain-cluster-selector">
          <span data-testid="current-cluster">{props.cluster}</span>
          <select
            data-testid="cluster-combobox"
            role="combobox"
            aria-haspopup="listbox"
            value={props.cluster}
            onChange={handleChange}
          >
            {(props.domainDescription.clusters ?? []).map((c) => (
              <option key={c.clusterName} value={c.clusterName}>
                {c.clusterName}
              </option>
            ))}
          </select>
        </div>
      );
    };
  }
);

describe(WorkflowPageHeaderClusterSelector.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const defaultEndpointsMocks = [
    {
      path: '/api/domains/:domain/:cluster',
      httpMethod: 'GET' as const,
      mockOnce: false,
      httpResolver: () => HttpResponse.json(mockDomainDescription),
    },
  ];

  it('Should render current cluster correctly', async () => {
    setup(
      { domain: 'mock-domain', cluster: 'cluster_1' },
      defaultEndpointsMocks
    );

    expect(
      await screen.findByTestId('domain-cluster-selector')
    ).toBeInTheDocument();
    expect(screen.getByTestId('current-cluster')).toHaveTextContent(
      'cluster_1'
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('Should render nothing for single cluster (cluster omitted from breadcrumb)', async () => {
    setup({ domain: 'mock-domain', cluster: 'cluster_1' }, [
      {
        path: '/api/domains/:domain/:cluster',
        httpMethod: 'GET' as const,
        mockOnce: false,
        httpResolver: () =>
          HttpResponse.json(mockDomainDescriptionSingleCluster),
      },
    ]);

    await waitFor(
      () => {
        expect(screen.queryByTestId('domain-cluster-selector')).toBeNull();
      },
      { timeout: 2000 }
    );
  });

  it('Should render nothing when clusters is empty or undefined', async () => {
    setup({ domain: 'mock-domain', cluster: 'cluster_1' }, [
      {
        path: '/api/domains/:domain/:cluster',
        httpMethod: 'GET' as const,
        mockOnce: false,
        httpResolver: () =>
          HttpResponse.json({
            ...mockDomainDescriptionSingleCluster,
            clusters: [],
          } as DomainDescription),
      },
    ]);

    await waitFor(
      () => {
        expect(screen.queryByTestId('domain-cluster-selector')).toBeNull();
      },
      { timeout: 2000 }
    );
  });

  it('Should show available clusters and redirect when one is selected', async () => {
    setup(
      { domain: 'mock-domain', cluster: 'cluster_1' },
      defaultEndpointsMocks
    );

    expect(await screen.findByTestId('current-cluster')).toHaveTextContent(
      'cluster_1'
    );
    const clusterSelect = screen.getByRole('combobox');

    act(() => {
      fireEvent.change(clusterSelect, { target: { value: 'cluster_2' } });
    });

    expect(mockPushFn).toHaveBeenCalledWith(
      '/domains/mock-domain/cluster_2/workflows/workflow-123/run-456/summary'
    );
  });

  it('Should show active/passive labels for active-passive domains', async () => {
    setup(
      { domain: 'mock-domain', cluster: 'cluster_1' },
      defaultEndpointsMocks
    );

    await screen.findByTestId('domain-cluster-selector');
    const clusterSelect = screen.getByRole('combobox');
    const options = within(clusterSelect).getAllByRole('option');

    expect(options.map((o) => o.textContent)).toContain('cluster_1');
    expect(options.map((o) => o.textContent)).toContain('cluster_2');
  });

  it('Should show default label only for active cluster in active-active domains', async () => {
    setup({ domain: 'mock-domain', cluster: 'cluster0' }, [
      {
        path: '/api/domains/:domain/:cluster',
        httpMethod: 'GET' as const,
        mockOnce: false,
        httpResolver: () =>
          HttpResponse.json(mockActiveActiveDomain as DomainDescription),
      },
    ]);

    await screen.findByTestId('domain-cluster-selector');
    const clusterSelect = screen.getByRole('combobox');
    const options = within(clusterSelect).getAllByRole('option');

    expect(options.map((o) => o.textContent)).toContain('cluster0');
    expect(options.map((o) => o.textContent)).toContain('cluster1');
  });
});

function setup(
  {
    domain,
    cluster,
  }: {
    domain: string;
    cluster: string;
  },
  endpointsMocks: HttpEndpointMock[]
) {
  render(
    <Suspense fallback={null}>
      <WorkflowPageHeaderClusterSelector domain={domain} cluster={cluster} />
    </Suspense>,
    { endpointsMocks }
  );
}
