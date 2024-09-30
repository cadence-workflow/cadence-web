import { toaster } from 'baseui/toast';
import { HttpResponse } from 'msw';

import { render, fireEvent, screen, act, waitFor } from '@/test-utils/rtl';

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';

import type { Props as MSWMocksHandlersProps } from '../../../../test-utils/msw-mock-handlers/msw-mock-handlers.types';
import { completedActivityTaskEvents } from '../../__fixtures__/workflow-history-activity-events';
import WorkflowHistoryExportJsonButton from '../workflow-history-export-json-button';
import { type Props } from '../workflow-history-export-json-button.types';

jest.mock('@/utils/logger');
jest.mock('baseui/toast', () => ({
  ...jest.requireActual('baseui/toast'),
  toaster: {
    negative: jest.fn(),
  },
}));

describe('WorkflowHistoryExportJsonButton', () => {
  const originalCreateObjectURL = window.URL.createObjectURL;

  afterEach(() => {
    jest.clearAllMocks();
    window.URL.createObjectURL = originalCreateObjectURL;
  });

  it('should render the button with "Export JSON"', () => {
    setup({});
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
  });

  it('should show spinner when loading', async () => {
    const { getRequestResolver } = setup({ wait: true });
    fireEvent.click(screen.getByText('Export JSON'));

    expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    await act(() => {
      const resolver = getRequestResolver();
      resolver();
    });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should call request API and download JSON file', async () => {
    const createObjectURLMock: jest.Mock = jest.fn();
    window.URL.createObjectURL = createObjectURLMock;

    setup({});

    fireEvent.click(screen.getByText('Export JSON'));

    await waitFor(() => {
      expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob));
    });
  });

  it('should handle error and show toast', async () => {
    setup({ error: true });
    fireEvent.click(screen.getByText('Export JSON'));

    await waitFor(() => {
      expect(toaster.negative).toHaveBeenCalledWith(
        'Failed to export workflow history'
      );
    });
  });
});

function setup({
  error,
  wait,
  ...overrides
}: Partial<Props> & { error?: boolean; loading?: boolean; wait?: boolean }) {
  const defaultProps: Props = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflowId',
    runId: 'test-runId',
  };
  const mockEvents: HistoryEvent[] = completedActivityTaskEvents;
  const totalEventsCount = mockEvents.length;
  let currentEventIndex = 0;
  let requestResolver = () => {};
  const getRequestResolver = () => requestResolver;

  render(<WorkflowHistoryExportJsonButton {...defaultProps} {...overrides} />, {
    endpointsMocks: [
      {
        path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/history',
        httpMethod: 'GET',
        httpResolver: async () => {
          const index = currentEventIndex;
          currentEventIndex = currentEventIndex + 1;
          if (wait && currentEventIndex === 0) {
            await new Promise<void>((resolve) => {
              requestResolver = () => {
                resolve();
              };
            });
          }
          if (error)
            return HttpResponse.json(
              { message: 'Failed to fetch workflow history' },
              { status: 500 }
            );

          return HttpResponse.json(
            {
              history: {
                events: [mockEvents[index]],
              },
              archived: false,
              nextPageToken: index < totalEventsCount - 1 ? '' : `${index + 1}`,
              rawHistory: [],
            } satisfies GetWorkflowHistoryResponse,
            { status: 200 }
          );
        },
      },
    ] as MSWMocksHandlersProps['endpointsMocks'],
  });

  return { getRequestResolver };
}
