import { render, screen, waitFor } from '@/test-utils/rtl';

import {
  mockActivityEventGroup,
  mockTimerEventGroup,
} from '../../__fixtures__/workflow-history-event-groups';
import WorkflowHistoryTimelineChart from '../workflow-history-timeline-chart';

jest.mock('@/components/timeline/timeline', () =>
  jest.fn(() => <div>Mock timeline</div>)
);

jest.mock('../helpers/convert-event-group-to-timeline-item.ts', () =>
  jest.fn().mockReturnValue({})
);

describe(WorkflowHistoryTimelineChart.name, () => {
  it('renders correctly', async () => {
    setup({});
    expect(await screen.findByText('Mock timeline')).toBeInTheDocument();
  });

  it('renders in loading state if isLoading is true', async () => {
    setup({ isLoading: true });
    expect(await screen.findByText('Mock timeline')).toBeInTheDocument();
    expect(await screen.findByText('Loading events')).toBeInTheDocument();
  });

  it('fetches more events if possible', async () => {
    const { mockFetchMoreEvents } = setup({ hasMoreEvents: true });

    await waitFor(() => {
      expect(mockFetchMoreEvents).toHaveBeenCalled();
    });
  });

  it('does not fetch more events if a fetch is already in progress', async () => {
    const { mockFetchMoreEvents } = setup({
      hasMoreEvents: true,
      isFetchingMoreEvents: true,
    });

    expect(mockFetchMoreEvents).not.toHaveBeenCalled();
  });
});

function setup({
  isLoading = false,
  hasMoreEvents = false,
  isFetchingMoreEvents = false,
}: {
  isLoading?: boolean;
  hasMoreEvents?: boolean;
  isFetchingMoreEvents?: boolean;
}) {
  const mockFetchMoreEvents = jest.fn();
  render(
    <WorkflowHistoryTimelineChart
      eventGroupsEntries={[
        ['Group 1', mockActivityEventGroup],
        ['Group 2', mockTimerEventGroup],
      ]}
      isLoading={isLoading}
      hasMoreEvents={hasMoreEvents}
      fetchMoreEvents={mockFetchMoreEvents}
      isFetchingMoreEvents={isFetchingMoreEvents}
    />
  );

  return { mockFetchMoreEvents };
}
