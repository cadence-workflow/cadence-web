import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import {
  render,
  screen,
  userEvent,
  waitForElementToBeRemoved,
} from '@/test-utils/rtl';

import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';

import WorkflowStackTrace from '../workflow-stack-trace';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(() => <div>Error Panel</div>)
);

jest.mock('baseui/skeleton', () => ({
  Skeleton: jest.fn(() => <div>Loading Skeleton</div>),
}));
jest.mock('baseui/spinner', () => ({
  Spinner: jest.fn(() => <div data-testid="spinner"></div>),
}));

describe('WorkflowStackTrace', () => {
  it('should render correctly with no fetching or error', async () => {
    await setup({ resultStackTrace: 'result stack trace' });
    expect(screen.getByText(/Last updated/)).toBeInTheDocument();
    expect(screen.getByText('result stack trace')).toBeInTheDocument();
    expect(screen.queryByText('Error Panel')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading Skeleton')).not.toBeInTheDocument();
  });

  it('should show loading state on refetch', async () => {
    const { getRequestResolver } = await setup({
      resolveRefreshManually: true,
    });

    const button = await screen.findByRole('button', { name: /Refresh/i });
    await userEvent.click(button);
    expect(screen.getByText('Loading Skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Error Panel')).not.toBeInTheDocument();
    expect(screen.queryByText('test stack trace')).not.toBeInTheDocument();

    const refetchResolver = getRequestResolver();
    refetchResolver();
    expect(await screen.findByText('test stack trace')).toBeInTheDocument();
    expect(screen.queryByText('Loading Skeleton')).not.toBeInTheDocument();
    expect(screen.queryByText('Error Panel')).not.toBeInTheDocument();
  });

  it('should disable the refresh button when refetching', async () => {
    await setup({
      resolveRefreshManually: true,
    });

    const refreshButton = await screen.findByRole('button', {
      name: /Refresh/i,
    });
    await userEvent.click(refreshButton);

    expect(refreshButton).toBeDisabled();
  });

  it('should show error state when refetch fails', async () => {
    const { getRequestRejector } = await setup({
      resolveRefreshManually: true,
    });
    const button = await screen.findByRole('button', { name: /Refresh/i });
    await userEvent.click(button);
    const refetchRejector = getRequestRejector();
    refetchRejector();

    expect(await screen.findByText('Error Panel')).toBeInTheDocument();
    expect(screen.queryByText('Loading Skeleton')).not.toBeInTheDocument();
  });
  it('should display no stack trace when data.result is null or empty', async () => {
    await setup({
      resultStackTrace: '',
    });
    expect(screen.getByText('No stack trace...')).toBeInTheDocument();
  });

  it('should show spinner on refresh button when fetching', async () => {
    await setup({
      resolveRefreshManually: true,
    });

    const refreshButton = await screen.findByRole('button', {
      name: /Refresh/i,
    });
    await userEvent.click(refreshButton);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});

async function setup({
  initReqError,
  resolveRefreshManually,
  resultStackTrace = 'test stack trace',
}: {
  initReqError?: boolean;
  resolveRefreshManually?: boolean;
  resultStackTrace?: string;
}) {
  let requestResolver = () => {};
  let requestRejector = () => {};
  const getRequestResolver = () => requestResolver;
  const getRequestRejector = () => requestRejector;
  let requestIndex = -1;
  render(
    <Suspense fallback="Suspense placeholder">
      <WorkflowStackTrace
        params={{
          domain: 'test-domain',
          cluster: 'test-cluster',
          runId: 'test-runid',
          workflowId: 'test-workflowId',
          workflowTab: 'stackTrace',
        }}
      />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query/__stack_trace',
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async () => {
            requestIndex = requestIndex + 1;
            if (requestIndex === 0 && initReqError)
              return HttpResponse.json(
                { message: 'Failed to fetch workflow stack trace' },
                { status: 500 }
              );

            if (requestIndex > 0 && resolveRefreshManually) {
              await new Promise((resolve, reject) => {
                requestResolver = () =>
                  resolve(
                    HttpResponse.json(
                      {
                        rejected: null,
                        result: resultStackTrace,
                      } satisfies QueryWorkflowResponse,
                      { status: 200 }
                    )
                  );
                requestRejector = () =>
                  reject(
                    HttpResponse.json(
                      { message: 'Failed to fetch workflow stack trace' },
                      { status: 500 }
                    )
                  );
              });
            }
            return HttpResponse.json(
              {
                rejected: null,
                result: resultStackTrace,
              } satisfies QueryWorkflowResponse,
              { status: 200 }
            );
          },
        },
      ],
    }
  );

  await waitForElementToBeRemoved(() =>
    screen.queryAllByText('Suspense placeholder')
  );

  return { getRequestResolver, getRequestRejector };
}
