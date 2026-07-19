import { render, screen, userEvent, within } from '@/test-utils/rtl';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';

import ScheduleRunsBackfillCell from '../schedule-runs-backfill-cell';

describe(ScheduleRunsBackfillCell.name, () => {
  it('shows the Backfill ID tooltip on hover', async () => {
    const { user } = setup({ isBackfill: true, backfillId: 'backfill-123' });

    await user.hover(screen.getByText('Yes'));
    expectTooltipContent(await screen.findByRole('tooltip'), 'backfill-123');
  });

  it('shows the Backfill ID tooltip on keyboard focus', async () => {
    const { user } = setup({ isBackfill: true, backfillId: 'backfill-123' });

    await user.tab();
    expect(screen.getByText('Yes').closest('[tabindex="0"]')).toHaveFocus();
    expectTooltipContent(await screen.findByRole('tooltip'), 'backfill-123');
  });

  it('renders No without a tooltip for a regular run', async () => {
    const { user } = setup({ isBackfill: false, backfillId: 'ignored' });

    await user.hover(screen.getByText('No'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('handles missing and malformed Backfill IDs', () => {
    const { rerender } = setup({ isBackfill: true });
    expect(screen.getByText('Yes')).toBeInTheDocument();

    rerender(
      <ScheduleRunsBackfillCell
        {...getMockWorkflowListItem({
          searchAttributes: {
            CadenceScheduleIsBackfill: { data: btoa('true') },
            CadenceScheduleBackfillID: { data: btoa('123') },
          },
        })}
      />
    );
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

function expectTooltipContent(tooltip: HTMLElement, backfillId: string) {
  const label = within(tooltip).getByText('Backfill Id:');
  expect(within(tooltip).getByText(backfillId)).toBeInTheDocument();
}

function setup({
  isBackfill,
  backfillId,
}: {
  isBackfill: boolean;
  backfillId?: string;
}) {
  const user = userEvent.setup();
  const searchAttributes = {
    CadenceScheduleIsBackfill: { data: btoa(String(isBackfill)) },
    ...(backfillId && {
      CadenceScheduleBackfillID: { data: btoa(JSON.stringify(backfillId)) },
    }),
  };
  const renderResult = render(
    <ScheduleRunsBackfillCell
      {...getMockWorkflowListItem({ searchAttributes })}
    />
  );
  return { ...renderResult, user };
}
