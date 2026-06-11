import React from 'react';

import { userEvent } from '@testing-library/user-event';
import { HttpResponse } from 'msw';

import { render, screen, waitFor, act } from '@/test-utils/rtl';

import { type ListBatchActionsResponse } from '@/route-handlers/list-batch-actions/list-batch-actions.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import DomainBatchActions from '../domain-batch-actions';
import { type Props as DetailProps } from '../domain-batch-actions-detail/domain-batch-actions-detail.types';
import { type Props as NewActionDetailProps } from '../domain-batch-actions-new-action-detail/domain-batch-actions-new-action-detail.types';
import { type Props as SidebarProps } from '../domain-batch-actions-sidebar/domain-batch-actions-sidebar.types';
import { type BatchAction } from '../domain-batch-actions.types';

const mockSetQueryParams = jest.fn();
const mockUsePageQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUsePageQueryParams(...args),
}));

const mockEnqueue = jest.fn();
const mockDequeue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: mockDequeue,
  }),
}));

jest.mock(
  '../domain-batch-actions-new-action-detail/domain-batch-actions-new-action-detail',
  () => ({
    __esModule: true,
    default: ({ onDiscard }: NewActionDetailProps) => (
      <div>
        <h2>New batch action</h2>
        <button onClick={onDiscard}>Discard batch action</button>
      </div>
    ),
  })
);

jest.mock('../domain-batch-actions-detail/domain-batch-actions-detail', () => ({
  __esModule: true,
  default: ({ batchAction, loading }: DetailProps) => (
    <div>
      {loading && <span>mock-batch-action-detail-loading</span>}
      mock-batch-action-detail-{batchAction?.id}
    </div>
  ),
}));

jest.mock(
  '../domain-batch-actions-sidebar/domain-batch-actions-sidebar',
  () => ({
    __esModule: true,
    default: ({
      batchActions,
      onSelectAction,
      onSelectDraft,
      onCreateNew,
      fetchNextPage,
    }: SidebarProps) => (
      <div>
        <button onClick={onCreateNew}>mock-new-batch-action</button>
        <button onClick={onSelectDraft}>mock-select-draft</button>
        <button onClick={fetchNextPage}>mock-fetch-next-page</button>
        {batchActions.map((a) => (
          <button key={a.id} onClick={() => onSelectAction(a.id)}>
            mock-select-{a.id}
          </button>
        ))}
      </div>
    ),
  })
);

const mockBatchActionsResponse: ListBatchActionsResponse = {
  batchActions: [
    { id: '5', status: 'RUNNING' },
    { id: '4', status: 'COMPLETED' },
  ],
  nextPageToken: '',
};

describe(DomainBatchActions.name, () => {
  beforeEach(() => {
    mockSetQueryParams.mockClear();
    mockUsePageQueryParams.mockReturnValue([
      { ...mockDomainPageQueryParamsValues, batchQuery: '' },
      mockSetQueryParams,
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders detail panel for the first batch action by default', async () => {
    setup();

    expect(
      await screen.findByText('mock-batch-action-detail-5')
    ).toBeInTheDocument();
  });

  it('updates URL param when a different action is selected', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByText('mock-select-4'));

    expect(mockSetQueryParams).toHaveBeenCalledWith({ batchActionId: '4' });
  });

  it('sets batchActionId to draft and prefills the query when "New batch action" is clicked', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByText('mock-new-batch-action'));

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      batchActionId: 'draft',
      batchQuery: 'CloseTime = missing',
    });
  });

  it('clears batchActionId and batchQuery on discard', async () => {
    mockUsePageQueryParams.mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        batchActionId: 'draft',
        batchQuery: 'WorkflowType="foo"',
      },
      mockSetQueryParams,
    ]);

    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByText('Discard batch action'));

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      batchActionId: undefined,
      batchQuery: '',
    });
  });

  it('opens the draft when batchActionId is "draft" (no batchQuery)', async () => {
    mockUsePageQueryParams.mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        batchActionId: 'draft',
        batchQuery: '',
      },
      mockSetQueryParams,
    ]);

    setup();

    expect(
      await screen.findByRole('heading', { name: 'New batch action' })
    ).toBeInTheDocument();
  });

  it('renders the specified batch action when batchActionId is set', async () => {
    mockUsePageQueryParams.mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        batchActionId: '4',
        batchQuery: '',
      },
      mockSetQueryParams,
    ]);

    setup();

    expect(
      await screen.findByText('mock-batch-action-detail-4')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('mock-batch-action-detail-5')
    ).not.toBeInTheDocument();
  });

  it('sets batchActionId to draft when selecting the draft sidebar item', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByText('mock-select-draft'));

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      batchActionId: 'draft',
    });
  });

  it('renders items from all fetched pages when paginating', async () => {
    const user = userEvent.setup();

    setup({
      pages: [
        {
          batchActions: [
            { id: '5', status: 'RUNNING' },
            { id: '4', status: 'COMPLETED' },
          ],
          nextPageToken: 'page-2',
        },
        {
          batchActions: [
            { id: '3', status: 'COMPLETED' },
            { id: '2', status: 'COMPLETED' },
          ],
          nextPageToken: '',
        },
      ],
    });

    expect(await screen.findByText('mock-select-5')).toBeInTheDocument();
    expect(screen.queryByText('mock-select-3')).not.toBeInTheDocument();

    await user.click(screen.getByText('mock-fetch-next-page'));

    expect(await screen.findByText('mock-select-3')).toBeInTheDocument();
    expect(screen.getByText('mock-select-5')).toBeInTheDocument();
    expect(screen.getByText('mock-select-2')).toBeInTheDocument();
  });

  it('enqueues an error snackbar when fetching batch action details fails', async () => {
    setup({ describeError: true });

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledTimes(1);
    });
    expect(mockEnqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Failed to fetch describe',
        actionMessage: 'OK',
      })
    );
  });

  it('enqueues the error snackbar only once across repeated failed refetches', async () => {
    jest.useFakeTimers();
    try {
      let detailCalls = 0;
      setup({
        detailResolver: () => {
          detailCalls += 1;
          // First load succeeds with a RUNNING action so the hook starts
          // polling; every subsequent refetch fails with a fresh error object.
          return detailCalls === 1
            ? HttpResponse.json({ id: '5', status: 'RUNNING' })
            : HttpResponse.json(
                { message: 'Failed to fetch describe' },
                { status: 500 }
              );
        },
      });

      // Flush the initial list + detail fetches.
      await act(async () => {
        await jest.advanceTimersByTimeAsync(0);
      });
      expect(mockEnqueue).not.toHaveBeenCalled();

      // Advance past several polling intervals — each refetch fails.
      await act(async () => {
        await jest.advanceTimersByTimeAsync(30000);
      });

      expect(mockEnqueue).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });
});

function setup({
  pages = [mockBatchActionsResponse],
  describeError = false,
  detailResolver,
}: {
  pages?: ListBatchActionsResponse[];
  describeError?: boolean;
  detailResolver?: () => ReturnType<typeof HttpResponse.json>;
} = {}) {
  return render(
    <DomainBatchActions domain="test-domain" cluster="test-cluster" />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/batch-actions',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            const url = new URL(request.url);
            const nextPage = url.searchParams.get('nextPage');
            const pageIndex = nextPage
              ? pages.findIndex((p) => p.nextPageToken === nextPage) + 1
              : 0;
            return HttpResponse.json(pages[pageIndex] ?? pages[0]);
          },
        },
        {
          path: '/api/domains/:domain/:cluster/batch-actions/:batchActionId',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ params }) => {
            if (detailResolver) {
              return detailResolver();
            }
            if (describeError) {
              return HttpResponse.json(
                { message: 'Failed to fetch describe' },
                { status: 500 }
              );
            }
            const detail: BatchAction = {
              id: params.batchActionId as string,
              status: 'COMPLETED',
            };
            return HttpResponse.json(detail);
          },
        },
      ],
    }
  );
}
