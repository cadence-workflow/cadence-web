import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { type Props as MSWMocksHandlersProps } from '@/test-utils/msw-mock-handlers/msw-mock-handlers.types';

import ScheduleRuns from '../schedule-runs';

jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () => jest.fn(() => <div>Loading schedule runs</div>)
);

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: ErrorPanelProps) => <div>{message}</div>)
);

describe(ScheduleRuns.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queries the schedule and renders its runs as JSON', async () => {
    const scheduleId = String.raw`schedule"\id`;
    setup({ scheduleId });

    expect(await screen.findByText(/first-page-workflow/)).toBeInTheDocument();
  });

  it('renders the initial loading state', () => {
    setup({ isLoading: true });

    expect(screen.getByText('Loading schedule runs')).toBeInTheDocument();
  });

  it('renders a retryable request error', async () => {
    setup({ isError: true });

    expect(
      await screen.findByText('Failed to load schedule runs')
    ).toBeInTheDocument();
  });
});

function setup({
  scheduleId = 'test-schedule',
  isError = false,
  isLoading = false,
}: {
  scheduleId?: string;
  isError?: boolean;
  isLoading?: boolean;
} = {}) {
  const user = userEvent.setup();

  render(
    <ScheduleRuns
      params={{
        domain: 'test-domain',
        cluster: 'test-cluster',
        scheduleId,
        scheduleTab: 'runs',
      }}
    />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            if (isLoading) {
              return new Promise(() => {});
            }

            if (isError) {
              return HttpResponse.json(
                { message: 'Request failed' },
                { status: 500 }
              );
            }

            return HttpResponse.json({
              workflows: [
                getMockWorkflowListItem({
                  workflowID: 'first-page-workflow',
                }),
              ],
              nextPage: 'next-page',
            } satisfies ListWorkflowsResponse);
          },
        },
      ] as MSWMocksHandlersProps['endpointsMocks'],
    }
  );

  return { user };
}
