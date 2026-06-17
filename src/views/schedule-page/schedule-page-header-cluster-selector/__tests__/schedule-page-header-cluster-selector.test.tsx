import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, within } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { mockDomainDescription } from '@/views/domain-page/__fixtures__/domain-description';
import { type DomainDescription } from '@/views/domain-page/domain-page.types';
import type { Props as DomainClusterSelectorProps } from '@/views/shared/domain-cluster-selector/domain-cluster-selector.types';

import SchedulePageHeaderClusterSelector from '../schedule-page-header-cluster-selector';
import { type Props } from '../schedule-page-header-cluster-selector.types';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({
    domain: 'mock-domain',
    cluster: 'cluster_1',
    scheduleId: 'my-schedule',
    scheduleTab: 'details',
  }),
}));

const MockDomainClusterSelector = jest.fn(
  (props: DomainClusterSelectorProps) => (
    <>
      <div data-testid="domain-cluster-selector">{props.cluster}</div>
      <div data-testid="single-cluster-fallback-type">
        {props.singleClusterFallbackType}
      </div>
      <div data-testid="no-spacing">{props.noSpacing ? 'true' : 'false'}</div>
      <div data-testid="build-path-for-cluster">
        {typeof props.buildPathForCluster === 'function'
          ? props.buildPathForCluster('cluster_2')
          : 'undefined'}
      </div>
    </>
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

describe(SchedulePageHeaderClusterSelector.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders DomainClusterSelector with correct props', async () => {
    setup({ domain: 'mock-domain', cluster: 'cluster_1' });

    expect(
      await screen.findByTestId('domain-cluster-selector')
    ).toBeInTheDocument();

    expect(
      within(screen.getByTestId('single-cluster-fallback-type')).getByText(
        'none'
      )
    ).toBeInTheDocument();

    expect(
      within(screen.getByTestId('no-spacing')).getByText('true')
    ).toBeInTheDocument();
  });

  it('throws when domain API returns an error', async () => {
    setup({ domain: 'mock-domain', cluster: 'cluster_1', isError: true });

    expect(await screen.findByText('Error loading domain')).toBeInTheDocument();
    expect(
      screen.queryByTestId('domain-cluster-selector')
    ).not.toBeInTheDocument();
  });

  it('builds the cluster path preserving scheduleId and tab', async () => {
    setup({ domain: 'mock-domain', cluster: 'cluster_1' });

    await screen.findByTestId('domain-cluster-selector');
    expect(screen.getByTestId('build-path-for-cluster')).toHaveTextContent(
      '/domains/mock-domain/cluster_2/schedules/my-schedule/details'
    );
  });
});

function setup({
  domain,
  cluster,
  isError,
}: Props & { isError?: boolean; domainDescription?: DomainDescription }) {
  render(
    <ErrorBoundary
      fallbackRender={() => <div>Error loading domain</div>}
      omitLogging
    >
      <Suspense fallback={null}>
        <SchedulePageHeaderClusterSelector domain={domain} cluster={cluster} />
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
              : HttpResponse.json(mockDomainDescription),
        },
      ],
    }
  );
}
