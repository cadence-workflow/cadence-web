import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import { type CountWorkflowsResponse } from '@/views/shared/hooks/use-count-workflows.types';

import { type Props as MSWMocksHandlersProps } from '../../../../test-utils/msw-mock-handlers/msw-mock-handlers.types';
import DomainPageBatchActionsBadge from '../domain-page-batch-actions-badge';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({
    domain: 'my-domain',
    cluster: 'my-cluster',
  }),
}));

describe(DomainPageBatchActionsBadge.name, () => {
  it('renders the count when there are running batch actions', async () => {
    setup({ count: 3 });

    expect(await screen.findByText('3')).toBeInTheDocument();
  });

  it('renders nothing when the count is zero', async () => {
    setup({ count: 0 });

    await waitFor(() => {
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });

  it('renders nothing while the count request is in flight', () => {
    setup({ count: 1, delayResponse: true });

    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  it('renders nothing when the count request errors', async () => {
    setup({ count: 1, errorResponse: true });

    await waitFor(() => {
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  it('queries the batcher domain with a query filtered by the current domain', async () => {
    const requestUrls: Array<string> = [];
    setup({
      count: 1,
      onRequest: (url) => requestUrls.push(url),
    });

    await screen.findByText('1');

    expect(requestUrls).toHaveLength(1);
    const url = new URL(requestUrls[0]);
    expect(url.pathname).toBe(
      '/api/domains/cadence-batcher/my-cluster/workflows/count'
    );
    expect(url.searchParams.get('inputType')).toBe('query');
    const query = url.searchParams.get('query') ?? '';
    expect(query).toContain('cadence-sys-batch-workflow-v2');
    expect(query).toContain('CustomDomain = "my-domain"');
    expect(query).toContain('CloseTime = missing');
  });
});

function setup({
  count = 0,
  delayResponse = false,
  errorResponse = false,
  onRequest,
}: {
  count?: number;
  delayResponse?: boolean;
  errorResponse?: boolean;
  onRequest?: (url: string) => void;
}) {
  const countResponse: CountWorkflowsResponse = { count };

  return render(<DomainPageBatchActionsBadge />, {
    endpointsMocks: [
      {
        path: '/api/domains/:domain/:cluster/workflows/count',
        httpMethod: 'GET',
        mockOnce: false,
        httpResolver: async ({ request }) => {
          onRequest?.(request.url);
          if (delayResponse) {
            await new Promise(() => {}); // never resolves — keeps request in flight
          }
          if (errorResponse) {
            return HttpResponse.json(
              { message: 'Internal error' },
              { status: 500 }
            );
          }
          return HttpResponse.json(countResponse);
        },
      },
    ] as MSWMocksHandlersProps['endpointsMocks'],
  });
}
