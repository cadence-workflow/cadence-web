import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type Props as LoaderProps } from '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader.types';
import { getMockScheduleListEntry } from '@/route-handlers/list-schedules/__fixtures__/mock-schedule-list-entries';
import { type ListSchedulesResponse } from '@/route-handlers/list-schedules/list-schedules.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import type { Props as MSWMocksHandlersProps } from '../../../test-utils/msw-mock-handlers/msw-mock-handlers.types';
import DomainSchedules from '../domain-schedules';

const SCHEDULES_PER_PAGE = 2;

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () => jest.fn(() => <div data-testid="loading-indicator">Loading...</div>)
);

jest.mock(
  '@/components/table/table-infinite-scroll-loader/table-infinite-scroll-loader',
  () =>
    jest.fn((props: LoaderProps) => (
      <button data-testid="mock-loader" onClick={props.fetchNextPage}>
        {props.error ? 'Mock end: Error' : 'Mock end: OK'}
      </button>
    ))
);

jest.mock('../domain-schedules-header/domain-schedules-header', () =>
  jest.fn(({ count }: { count: number | undefined }) => (
    <div data-testid="mock-header">
      Schedules header (count={count === undefined ? 'loading' : count})
    </div>
  ))
);

jest.mock('../config/schedules-table.config', () => [
  {
    name: 'Schedule Id',
    id: 'ScheduleId',
    renderCell: ({ scheduleId }: { scheduleId: string }) => scheduleId,
    width: '25%',
  },
]);

const mockUsePageQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUsePageQueryParams(...args),
}));

describe(DomainSchedules.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePageQueryParams.mockReturnValue([
      mockDomainPageQueryParamsValues,
      jest.fn(),
    ]);
  });

  it('renders loading indicator and a header in loading state while initial fetch is pending', () => {
    setup({ isLoading: true });

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    expect(screen.getByText(/count=loading/)).toBeInTheDocument();
  });

  it('renders the empty state when no schedules are returned', async () => {
    setup({ errorCase: 'no-schedules' });

    expect(await screen.findByText('No schedules found')).toBeInTheDocument();
    expect(screen.getByText(/count=0/)).toBeInTheDocument();
  });

  it('renders the title with the count and the table when schedules load', async () => {
    setup();

    expect(await screen.findByText(/count=2/)).toBeInTheDocument();
    expect(screen.getByText('Schedule Id')).toBeInTheDocument();
    expect(screen.getByText('mock-schedule-id-0-0')).toBeInTheDocument();
  });

  it('updates the count after fetching the next page', async () => {
    const { user } = setup();

    expect(await screen.findByText(/count=2/)).toBeInTheDocument();

    await user.click(screen.getByTestId('mock-loader'));

    await waitFor(() => {
      expect(screen.getByText(/count=4/)).toBeInTheDocument();
    });
  });

  it('renders the failure error panel when initial fetch fails', async () => {
    setup({ errorCase: 'initial-fetch-error' });

    expect(
      await screen.findByText('Failed to load schedules')
    ).toBeInTheDocument();
  });

  it('still renders the table when a follow-up page fails', async () => {
    const { user } = setup({ errorCase: 'subsequent-fetch-error' });

    expect(await screen.findByText(/count=2/)).toBeInTheDocument();

    await user.click(screen.getByTestId('mock-loader'));

    expect(await screen.findByText('Mock end: Error')).toBeInTheDocument();
  });

  it('filters schedules by the search term and reflects the filtered count in the title', async () => {
    mockUsePageQueryParams.mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        schedulesSearch: 'mock-schedule-id-0-1',
      },
      jest.fn(),
    ]);

    setup();

    expect(await screen.findByText(/count=1/)).toBeInTheDocument();
    expect(screen.getAllByText(/^mock-schedule-id-/)).toHaveLength(1);
  });

  it('filters schedules by the status query param', async () => {
    mockUsePageQueryParams.mockReturnValue([
      { ...mockDomainPageQueryParamsValues, schedulesStatus: 'PAUSED' },
      jest.fn(),
    ]);

    setup({ pausedScheduleIndex: 1 });

    expect(await screen.findByText(/count=1/)).toBeInTheDocument();
    expect(screen.getAllByText(/^mock-schedule-id-/)).toHaveLength(1);
  });

  it('renders the no-match state when filters return no results but schedules exist', async () => {
    mockUsePageQueryParams.mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        schedulesSearch: 'something-that-never-matches',
      },
      jest.fn(),
    ]);

    setup();

    expect(
      await screen.findByText('No schedules match your filters')
    ).toBeInTheDocument();
    expect(screen.getByText(/count=0/)).toBeInTheDocument();
  });
});

function setup(opts?: {
  errorCase?: 'initial-fetch-error' | 'subsequent-fetch-error' | 'no-schedules';
  isLoading?: boolean;
  pausedScheduleIndex?: number;
}) {
  const { errorCase, isLoading, pausedScheduleIndex } = opts ?? {};
  const pages = generateSchedulePages(2, pausedScheduleIndex);
  let currentEventIndex = 0;
  const user = userEvent.setup();

  const endpointsMocks = [
    {
      path: '/api/domains/:domain/:cluster/schedules',
      httpMethod: 'GET',
      mockOnce: false,
      httpResolver: async () => {
        if (isLoading) {
          return new Promise(() => {});
        }

        const index = currentEventIndex;
        currentEventIndex++;

        switch (errorCase) {
          case 'no-schedules':
            return HttpResponse.json({
              schedules: [],
              nextPageToken: '',
            });
          case 'initial-fetch-error':
            return HttpResponse.json(
              { message: 'Request failed' },
              { status: 500 }
            );
          case 'subsequent-fetch-error':
            if (index === 0) {
              return HttpResponse.json(pages[0]);
            } else if (index === 1) {
              return HttpResponse.json(
                { message: 'Request failed' },
                { status: 500 }
              );
            } else {
              return HttpResponse.json(pages[1]);
            }
          default:
            if (index === 0) {
              return HttpResponse.json(pages[0]);
            } else {
              return HttpResponse.json(pages[1]);
            }
        }
      },
    },
  ] as MSWMocksHandlersProps['endpointsMocks'];

  render(<DomainSchedules domain="d1" cluster="c1" />, { endpointsMocks });

  return { user };
}

function generateSchedulePages(
  count: number,
  pausedScheduleIndex?: number
): Array<ListSchedulesResponse> {
  const pages = Array.from(
    { length: count },
    (_, pageIndex): ListSchedulesResponse => ({
      schedules: Array.from({ length: SCHEDULES_PER_PAGE }, (_, index) =>
        getMockScheduleListEntry({
          scheduleId: `mock-schedule-id-${pageIndex}-${index}`,
          workflowType: { name: `mock-workflow-name-${pageIndex}-${index}` },
          state: {
            paused: index === pausedScheduleIndex,
            pauseInfo: null,
          },
        })
      ),
      nextPageToken: `${pageIndex + 1}`,
    })
  );

  pages[pages.length - 1].nextPageToken = '';
  return pages;
}
