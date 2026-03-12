import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { mockDomainDescription } from '@/views/domain-page/__fixtures__/domain-description';
import { type DomainDescription } from '@/views/domain-page/domain-page.types';
import type { Props as DomainClusterSelectorProps } from '@/views/shared/domain-cluster-selector/domain-cluster-selector.types';

import WorkflowPageHeaderClusterSelector from '../workflow-page-header-cluster-selector';
import { type Props } from '../workflow-page-header-cluster-selector.types';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({
    domain: 'mock-domain',
    cluster: 'cluster_1',
    workflowId: 'workflow-123',
    runId: 'run-456',
    workflowTab: 'summary',
  }),
}));

const MockDomainClusterSelector = jest.fn(
  (props: DomainClusterSelectorProps) => (
    <div data-testid="domain-cluster-selector">{props.cluster}</div>
  )
);
jest.mock(
  '@/views/shared/domain-cluster-selector/domain-cluster-selector',
  () => ({
    __esModule: true,
    default: (props: DomainClusterSelectorProps) =>
      MockDomainClusterSelector(props),
  })
);

describe(WorkflowPageHeaderClusterSelector.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders DomainClusterSelector with correct props', async () => {
    setup({ domain: 'mock-domain', cluster: 'cluster_1' });

    expect(
      await screen.findByTestId('domain-cluster-selector')
    ).toBeInTheDocument();
    expect(MockDomainClusterSelector).toHaveBeenCalledTimes(1);
    expect(MockDomainClusterSelector).toHaveBeenCalledWith(
      expect.objectContaining({
        domainDescription: mockDomainDescription,
        cluster: 'cluster_1',
        singleClusterRender: 'none',
        noSpacing: true,
      })
    );
  });

  it('shows throw an error when domain API returns an error', async () => {
    setup({ domain: 'mock-domain', cluster: 'cluster_1', isError: true });

    expect(await screen.findByText('Error loading domain')).toBeInTheDocument();
    expect(MockDomainClusterSelector).not.toHaveBeenCalled();
  });

  it('passes buildPathForCluster that builds workflow page path with encoded segments', async () => {
    setup({ domain: 'mock-domain', cluster: 'cluster_1' });

    await screen.findByTestId('domain-cluster-selector');
    const buildPathForCluster =
      MockDomainClusterSelector.mock.calls[0][0].buildPathForCluster;
    expect(buildPathForCluster).toBeDefined();

    expect(buildPathForCluster!('cluster_2')).toBe(
      '/domains/mock-domain/cluster_2/workflows/workflow-123/run-456/summary'
    );

    expect(buildPathForCluster!('cluster_with_special%chars')).toBe(
      '/domains/mock-domain/cluster_with_special%25chars/workflows/workflow-123/run-456/summary'
    );
  });
});

function setup({
  domain,
  cluster,
  domainDescription = mockDomainDescription,
  isError,
}: Props & {
  domainDescription?: DomainDescription;
  isError?: boolean;
}) {
  render(
    <ErrorBoundary
      fallbackRender={() => <div>Error loading domain</div>}
      omitLogging
    >
      <Suspense fallback={null}>
        <WorkflowPageHeaderClusterSelector domain={domain} cluster={cluster} />
      </Suspense>
    </ErrorBoundary>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: () =>
            isError
              ? HttpResponse.json({ message: 'Error' }, { status: 500 })
              : HttpResponse.json(domainDescription),
        },
      ],
    }
  );
}
