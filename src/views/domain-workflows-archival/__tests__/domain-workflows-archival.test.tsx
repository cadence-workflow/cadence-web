import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, act } from '@/test-utils/rtl';

import { type DescribeDomainResponse } from '@/route-handlers/describe-domain/describe-domain.types';
import { mockDomainInfo } from '@/views/domain-page/__fixtures__/domain-info';

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
  isError,
}: {
  isArchivalEnabled?: boolean;
  isError?: boolean;
}) {
  render(
    <Suspense>
      <DomainWorkflowsArchival domain="mock-domain" cluster="mock-cluster" />
    </Suspense>,
    {
      endpointsMocks: [
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
                  ...mockDomainInfo,
                  ...(isArchivalEnabled
                    ? {
                        historyArchivalStatus: 'ARCHIVAL_STATUS_ENABLED',
                        visibilityArchivalStatus: 'ARCHIVAL_STATUS_ENABLED',
                      }
                    : {}),
                } satisfies DescribeDomainResponse,
              }),
        },
      ],
    }
  );
}
