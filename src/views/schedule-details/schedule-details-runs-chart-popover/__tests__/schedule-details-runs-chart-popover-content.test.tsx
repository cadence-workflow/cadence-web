import { render, screen, userEvent } from '@/test-utils/rtl';

import ScheduleDetailsRunsChartPopoverContent from '../schedule-details-runs-chart-popover-content';
import {
  RUN_POPOVER_BACKFILL_LABEL,
  RUN_POPOVER_EMPTY_VALUE,
  RUN_POPOVER_NEXT_LABEL,
  RUN_POPOVER_SKIPPED_LABEL,
  RUN_POPOVER_STATUS_LABEL,
  RUN_POPOVER_TEST_IDS,
  RUN_POPOVER_TIMESTAMP_LABELS,
} from '../schedule-details-runs-chart-popover.constants';
import { type ChartRunPopoverEntry } from '../schedule-details-runs-chart-popover.types';

jest.mock('@/views/shared/workflow-status-tag/workflow-status-tag', () =>
  jest.fn(({ status }: { status: string }) => (
    <div data-testid="mock-workflow-status-tag">
      Mock workflow status: {status}
    </div>
  ))
);

const mockDomain = 'test-domain';
const mockCluster = 'test-cluster';

describe(ScheduleDetailsRunsChartPopoverContent.name, () => {
  it('renders the run id, status and timestamps for a run entry', () => {
    setup({
      entries: [
        {
          kind: 'run',
          run: {
            workflowId: 'wf-1',
            runId: 'run-1',
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 10, 0),
            startedTimeMs: Date.UTC(2024, 0, 1, 10, 1),
            endedTimeMs: Date.UTC(2024, 0, 1, 10, 5),
          },
        },
      ],
    });

    expect(screen.getByRole('link', { name: 'run-1' })).toHaveAttribute(
      'href',
      `/domains/${mockDomain}/${mockCluster}/workflows/wf-1/run-1`
    );
    expect(screen.getByText(RUN_POPOVER_STATUS_LABEL)).toBeInTheDocument();
    expect(screen.getByTestId('mock-workflow-status-tag')).toHaveTextContent(
      'Mock workflow status: WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED'
    );
    expect(
      screen.getByText(RUN_POPOVER_TIMESTAMP_LABELS.started)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(RUN_POPOVER_BACKFILL_LABEL)
    ).not.toBeInTheDocument();
  });

  it('renders a backfill link when the run belongs to a backfill', () => {
    setup({
      entries: [
        {
          kind: 'run',
          run: {
            workflowId: 'wf-1',
            runId: 'run-1',
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 10, 0),
            startedTimeMs: null,
            endedTimeMs: null,
            isBackfill: true,
            backfillId: 'backfill-123',
          },
        },
      ],
    });

    expect(screen.getByRole('link', { name: 'backfill-123' })).toHaveAttribute(
      'href',
      expect.stringContaining(
        encodeURIComponent('CadenceScheduleBackfillID="backfill-123"')
      )
    );
  });

  it('renders a skipped entry with only its scheduled time', () => {
    setup({
      entries: [
        { kind: 'skipped', scheduledTimeMs: Date.UTC(2024, 0, 1, 9, 0) },
      ],
    });

    expect(screen.getByText(RUN_POPOVER_SKIPPED_LABEL)).toBeInTheDocument();
    expect(screen.getAllByText(RUN_POPOVER_EMPTY_VALUE)).toHaveLength(2);
  });

  it('renders a next entry with only its scheduled time', () => {
    setup({
      entries: [{ kind: 'next', scheduledTimeMs: Date.UTC(2024, 0, 1, 13, 0) }],
    });

    expect(screen.getByText(RUN_POPOVER_NEXT_LABEL)).toBeInTheDocument();
    expect(screen.getAllByText(RUN_POPOVER_EMPTY_VALUE)).toHaveLength(2);
  });

  it('renders one entry per stacked run', () => {
    setup({
      entries: [
        {
          kind: 'run',
          run: {
            workflowId: 'wf-1',
            runId: 'run-1',
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 10, 0),
            startedTimeMs: null,
            endedTimeMs: null,
          },
        },
        {
          kind: 'run',
          run: {
            workflowId: 'wf-2',
            runId: 'run-2',
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
            scheduledTimeMs: Date.UTC(2024, 0, 1, 10, 0),
            startedTimeMs: null,
            endedTimeMs: null,
          },
        },
      ],
    });

    expect(screen.getAllByTestId(RUN_POPOVER_TEST_IDS.entry)).toHaveLength(2);
  });

  it('does not propagate pointer events to chart pan when clicking a run link', async () => {
    const handleParentPointerDown = jest.fn();
    const user = userEvent.setup();

    render(
      <div onPointerDown={handleParentPointerDown}>
        <ScheduleDetailsRunsChartPopoverContent
          entries={[
            {
              kind: 'run',
              run: {
                workflowId: 'wf-1',
                runId: 'run-1',
                status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
                scheduledTimeMs: Date.UTC(2024, 0, 1, 10, 0),
                startedTimeMs: null,
                endedTimeMs: null,
              },
            },
          ]}
          domain={mockDomain}
          cluster={mockCluster}
        />
      </div>
    );

    await user.click(screen.getByRole('link', { name: 'run-1' }));

    expect(handleParentPointerDown).not.toHaveBeenCalled();
  });
});

function setup({ entries }: { entries: ChartRunPopoverEntry[] }) {
  render(
    <ScheduleDetailsRunsChartPopoverContent
      entries={entries}
      domain={mockDomain}
      cluster={mockCluster}
    />
  );
}
