import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, act } from '@/test-utils/rtl';

import { type DescribeDomainResponse } from '@/route-handlers/describe-domain/describe-domain.types';
import { mockDomainDescription } from '@/views/domain-page/__fixtures__/domain-description';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import DomainWorkflowsArchival from '../domain-workflows-archival';

jest.mock(
  '../domain-workflows-archival-header/domain-workflows-archival-header',
  () => jest.fn(() => <div>Mock archival header</div>)
);

jest.mock(
  '../domain-workflows-archival-disabled-panel/domain-workflows-archival-disabled-panel',
  () => jest.fn(() => <div>Mock archival disabled panel</div>)
);

jest.mock(
  '../domain-workflows-archival-table/domain-workflows-archival-table',
  () => jest.fn(() => <div>Mock archival table</div>)
);

jest.mock(
  '../domain-workflows-archival-list/domain-workflows-archival-list',
  () => jest.fn(() => <div>Mock archival list</div>)
);

jest.mock(
  '../domain-workflows-archival-lookup/domain-workflows-archival-lookup',
  () => jest.fn(() => <div>Mock archival lookup</div>)
);

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

describe(DomainWorkflowsArchival.name, () => {
  it('renders without error and shows archival disabled page', async () => {
    await setup({});

    expect(
      await screen.findByText('Mock archival disabled panel')
    ).toBeInTheDocument();
  });

  it('renders without error and shows archival content', async () => {
    await setup({ isArchivalEnabled: true });

    expect(await screen.findByText('Mock archival header')).toBeInTheDocument();
    expect(await screen.findByText('Mock archival table')).toBeInTheDocument();
  });

  it('renders archival header and list when workflows list is enabled', async () => {
    await setup({
      isArchivalEnabled: true,
      isNewWorkflowsListEnabled: true,
    });

    expect(await screen.findByText('Mock archival header')).toBeInTheDocument();
    expect(await screen.findByText('Mock archival list')).toBeInTheDocument();
    expect(screen.queryByText('Mock archival table')).not.toBeInTheDocument();
  });

  it('renders the archival lookup panel when only history archival is enabled', async () => {
    await setup({ archivalStatusOverride: 'HISTORY_ONLY' });

    expect(await screen.findByText('Mock archival lookup')).toBeInTheDocument();
    expect(
      screen.queryByText('Mock archival disabled panel')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Mock archival header')).not.toBeInTheDocument();
  });

  it('does not render if the initial call fails', async () => {
    let renderErrorMessage;
    try {
      await act(async () => {
        await setup({ isError: true });
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Failed to fetch domain information');
  });
});

async function setup({
  isArchivalEnabled,
  isNewWorkflowsListEnabled = false,
  isError,
  archivalStatusOverride,
}: {
  isArchivalEnabled?: boolean;
  isNewWorkflowsListEnabled?: boolean;
  isError?: boolean;
  archivalStatusOverride?: 'HISTORY_ONLY';
}) {
  const archivalStatusFields = (() => {
    if (archivalStatusOverride === 'HISTORY_ONLY') {
      return {
        historyArchivalStatus: 'ARCHIVAL_STATUS_ENABLED',
        visibilityArchivalStatus: 'ARCHIVAL_STATUS_DISABLED',
      };
    }

    if (isArchivalEnabled) {
      return {
        historyArchivalStatus: 'ARCHIVAL_STATUS_ENABLED',
        visibilityArchivalStatus: 'ARCHIVAL_STATUS_ENABLED',
      };
    }

    return {};
  })();

  render(
    <Suspense>
      <DomainWorkflowsArchival domain="mock-domain" cluster="mock-cluster" />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: isNewWorkflowsListEnabled,
        },
        {
          path: '/api/domains/:domain/:cluster',
          httpMethod: 'GET',
          ...(isError
            ? {
                httpResolver: () => {
                  return HttpResponse.json(
                    { message: 'Failed to fetch domain information' },
                    { status: 500 }
                  );
                },
              }
            : {
                jsonResponse: {
                  ...mockDomainDescription,
                  ...archivalStatusFields,
                } satisfies DescribeDomainResponse,
              }),
        },
      ],
    }
  );
}
