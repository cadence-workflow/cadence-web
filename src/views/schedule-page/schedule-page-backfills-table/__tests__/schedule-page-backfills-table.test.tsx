import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import SchedulePageBackfillsTable from '../schedule-page-backfills-table';
import { type BackfillInfo } from '../schedule-page-backfills-table.types';

const mockBackfills: BackfillInfo[] = [
  {
    backfillId: 'backfill-abc-123',
    startTime: { seconds: '1700000000', nanos: 0 },
    endTime: { seconds: '1700086400', nanos: 0 },
    runsCompleted: 3,
    runsTotal: 10,
  },
  {
    backfillId: 'backfill-def-456',
    startTime: { seconds: '1700100000', nanos: 0 },
    endTime: null,
    runsCompleted: 0,
    runsTotal: 5,
  },
];

jest.mock('next/link', () =>
  function MockLink({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    return <a href={href}>{children}</a>;
  }
);

describe(SchedulePageBackfillsTable.name, () => {
  it('renders section title with count', () => {
    setup({});
    expect(screen.getByText('Ongoing backfills (2)')).toBeInTheDocument();
  });

  it('renders column headers when backfills are present', () => {
    setup({});
    expect(screen.getByText('Backfill ID')).toBeInTheDocument();
    expect(screen.getByText('Start time')).toBeInTheDocument();
    expect(screen.getByText('End time')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders backfill IDs as links', () => {
    setup({});
    const link = screen.getByRole('link', { name: 'backfill-abc-123' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      `/domains/test-domain/test-cluster/workflows?input=query&query=${encodeURIComponent('CadenceScheduleBackfillID="backfill-abc-123"')}`
    );
  });

  it('renders completed count as "X of Y"', () => {
    setup({});
    expect(screen.getByText('3 of 10')).toBeInTheDocument();
    expect(screen.getByText('0 of 5')).toBeInTheDocument();
  });

  it('renders em dash for null end time', () => {
    setup({});
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(1);
  });

  it('renders nothing when no backfills', () => {
    setup({ backfills: [] });
    expect(
      screen.queryByText(/ongoing backfills/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Backfill ID')).not.toBeInTheDocument();
  });

  it('collapses content when toggle button is clicked', async () => {
    const { user } = setup({});
    expect(screen.getByRole('link', { name: 'backfill-abc-123' })).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /collapse ongoing backfills/i })
    );

    expect(screen.queryByRole('link', { name: 'backfill-abc-123' })).not.toBeInTheDocument();
  });

  it('expands content again after collapsing', async () => {
    const { user } = setup({});

    await user.click(
      screen.getByRole('button', { name: /collapse ongoing backfills/i })
    );
    await user.click(
      screen.getByRole('button', { name: /expand ongoing backfills/i })
    );

    expect(screen.getByRole('link', { name: 'backfill-abc-123' })).toBeInTheDocument();
  });
});

function setup({ backfills = mockBackfills }: { backfills?: BackfillInfo[] }) {
  const user = userEvent.setup();
  render(
    <SchedulePageBackfillsTable
      backfills={backfills}
      domain="test-domain"
      cluster="test-cluster"
    />
  );
  return { user };
}
