import React from 'react';

import { userEvent } from '@testing-library/user-event';
import { HttpResponse } from 'msw';

import { render, screen, act } from '@/test-utils/rtl';

import { type ListBatchActionsResponse } from '@/route-handlers/list-batch-actions/list-batch-actions.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import DomainBatchActions from '../domain-batch-actions';
import { type Props as DetailProps } from '../domain-batch-actions-detail/domain-batch-actions-detail.types';
import { type Props as NewActionDetailProps } from '../domain-batch-actions-new-action-detail/domain-batch-actions-new-action-detail.types';
import { type Props as SidebarProps } from '../domain-batch-actions-sidebar/domain-batch-actions-sidebar.types';
import { BATCH_DRAFT_RESET_PARAMS } from '../domain-batch-actions.constants';
import { type BatchAction } from '../domain-batch-actions.types';

const mockSetQueryParams = jest.fn();
const mockUsePageQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUsePageQueryParams(...args),
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

jest.mock('@/components/error-panel/error-panel', () => ({
  __esModule: true,
  default: ({ message, actions }: any) => (
    <div>
      <span>mock-error-panel-{message}</span>
      {actions?.map((action: any) => (
        <button key={action.label} onClick={action.onClick}>
          {action.label}
        </button>
      ))}
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

  it('resets all batch draft params and prefills the query when "New batch action" is clicked', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByText('mock-new-batch-action'));

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      ...BATCH_DRAFT_RESET_PARAMS,
      batchActionId: 'draft',
      batchQuery: 'CloseTime = missing',
    });
  });

  it('clears all batch draft params on discard', async () => {
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

    expect(mockSetQueryParams).toHaveBeenCalledWith(BATCH_DRAFT_RESET_PARAMS);
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

  it('shows the error panel when the initial detail fetch fails', async () => {
    setup({ describeError: true });

    expect(
      await screen.findByText(
        'mock-error-panel-Failed to load batch action details'
      )
    ).toBeInTheDocument();
  });

  it('refetches the detail when the error panel retry action is clicked', async () => {
    const user = userEvent.setup();
    let detailCalls = 0;
    setup({
      detailResolver: () => {
        detailCalls += 1;
        // First load fails so the panel renders; the retry succeeds.
        return detailCalls === 1
          ? HttpResponse.json(
              { message: 'Failed to fetch describe' },
              { status: 500 }
            )
          : HttpResponse.json({ id: '5', status: 'COMPLETED' });
      },
    });

    await user.click(await screen.findByText('Retry'));

    expect(
      await screen.findByText('mock-batch-action-detail-5')
    ).toBeInTheDocument();
  });

  it('shows a stale-data banner (keeping the detail) when a background poll fails', async () => {
    jest.useFakeTimers();
    try {
      let detailCalls = 0;
      setup({
        detailResolver: () => {
          detailCalls += 1;
          // First load succeeds with a RUNNING action so the hook starts
          // polling; the next poll fails while data is already on screen.
          return detailCalls === 1
            ? HttpResponse.json({ id: '5', status: 'RUNNING' })
            : HttpResponse.json(
                { message: 'Failed to fetch describe' },
                { status: 500 }
              );
        },
      });

      // Flush the initial load, then advance past a polling interval so a
      // background poll fires and fails while data is already on screen.
      await act(async () => {
        await jest.advanceTimersByTimeAsync(0);
      });
      await act(async () => {
        await jest.advanceTimersByTimeAsync(30000);
      });

      // Banner appears, and the (stale) detail is still rendered.
      expect(
        screen.getByText(/Could not refresh batch action details/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText('mock-batch-action-detail-5')
      ).toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });

  it('shows a progress-error banner (keeping the detail) when the response flags progressError', async () => {
    setup({
      detailResolver: () =>
        HttpResponse.json({
          id: '5',
          status: 'COMPLETED',
          progressError: true,
        }),
    });

    expect(
      await screen.findByText(/Could not load batch action progress/i)
    ).toBeInTheDocument();
    expect(screen.getByText('mock-batch-action-detail-5')).toBeInTheDocument();
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
