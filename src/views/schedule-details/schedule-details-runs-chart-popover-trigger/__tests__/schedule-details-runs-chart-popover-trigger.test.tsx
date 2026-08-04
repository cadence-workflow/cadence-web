import { useState } from 'react';

import { type StatefulPopoverProps } from 'baseui/popover';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type ChartRunPopoverEntry } from '@/views/schedule-details/schedule-details-runs-chart-popover/schedule-details-runs-chart-popover.types';

import ScheduleDetailsRunsChartPopoverTrigger from '../schedule-details-runs-chart-popover-trigger';

// Mock StatefulPopover to render content immediately in tests
jest.mock('baseui/popover', () => {
  const originalModule = jest.requireActual('baseui/popover');
  return {
    ...originalModule,
    StatefulPopover: ({ content, children }: StatefulPopoverProps) => {
      const [isShown, setIsShown] = useState(false);

      return (
        <div>
          <div onMouseEnter={() => setIsShown(true)}>{children}</div>
          {isShown && typeof content === 'function'
            ? content({ close: () => setIsShown(false) })
            : null}
        </div>
      );
    },
  };
});

jest.mock(
  '@/views/schedule-details/schedule-details-runs-chart-popover/schedule-details-runs-chart-popover-content',
  () =>
    function MockScheduleDetailsRunsChartPopoverContent({
      entries,
      domain,
      cluster,
    }: {
      entries: ChartRunPopoverEntry[];
      domain: string;
      cluster: string;
    }) {
      return (
        <div data-testid="popover-content">
          {JSON.stringify({ entries, domain, cluster })}
        </div>
      );
    }
);

const mockEntries: ChartRunPopoverEntry[] = [
  { kind: 'skipped', scheduledTimeMs: Date.UTC(2024, 0, 1, 9, 0) },
];

describe(ScheduleDetailsRunsChartPopoverTrigger.name, () => {
  it('renders the hit area with the given aria label and test id', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Skipped run' })).toHaveAttribute(
      'data-testid',
      'skipped-trigger'
    );
  });

  it('does not show the popover content until the trigger is hovered', () => {
    setup();

    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('forwards entries, domain and cluster to the popover on hover', async () => {
    const user = userEvent.setup();
    setup();

    await user.hover(screen.getByRole('button', { name: 'Skipped run' }));

    expect(screen.getByTestId('popover-content')).toHaveTextContent(
      JSON.stringify({
        entries: mockEntries,
        domain: 'test-domain',
        cluster: 'test-cluster',
      })
    );
  });
});

function setup() {
  render(
    <ScheduleDetailsRunsChartPopoverTrigger
      x={10}
      y={20}
      entries={mockEntries}
      domain="test-domain"
      cluster="test-cluster"
      ariaLabel="Skipped run"
      testId="skipped-trigger"
    >
      <span>glyph</span>
    </ScheduleDetailsRunsChartPopoverTrigger>
  );
}
