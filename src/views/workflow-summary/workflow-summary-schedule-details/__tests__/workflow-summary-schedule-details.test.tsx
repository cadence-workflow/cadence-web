import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import WorkflowSummaryScheduleDetails from '../workflow-summary-schedule-details';
import { type Props } from '../workflow-summary-schedule-details.types';

jest.mock(
  '@/components/link/link',
  () =>
    function MockLink({
      children,
      href,
    }: React.PropsWithChildren<{ href: string }>) {
      return <a href={href}>{children}</a>;
    }
);

describe(WorkflowSummaryScheduleDetails.name, () => {
  it('does not render when schedules are disabled', async () => {
    setup({
      isSchedulesEnabled: false,
      searchAttributes: { CadenceScheduleID: 'schedule-id' },
    });

    await waitFor(() => {
      expect(
        screen.queryByRole('table', { name: 'Schedule details' })
      ).not.toBeInTheDocument();
    });
  });

  it('does not render without a schedule ID', async () => {
    setup({
      isSchedulesEnabled: true,
      searchAttributes: { CadenceScheduleTime: '2026-07-21T12:00:00Z' },
    });

    await waitFor(() => {
      expect(
        screen.queryByRole('table', { name: 'Schedule details' })
      ).not.toBeInTheDocument();
    });
  });

  it('renders schedule metadata and an encoded details link', async () => {
    setup({
      isSchedulesEnabled: true,
      domain: 'test/domain',
      cluster: 'test cluster',
      searchAttributes: {
        CadenceScheduleID: 'schedule/id',
        CadenceScheduleTime: '2026-07-21T12:00:00Z',
      },
    });

    expect(
      await screen.findByRole('table', { name: 'Schedule details' })
    ).toBeInTheDocument();
    expect(screen.getByText('2026-07-21T12:00:00Z')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'No' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'schedule/id' })).toHaveAttribute(
      'href',
      '/domains/test%2Fdomain/test%20cluster/schedules/schedule%2Fid/details'
    );
    expect(
      screen.queryByRole('rowheader', { name: 'Backfill ID' })
    ).not.toBeInTheDocument();
  });

  it('uses fallbacks for missing optional metadata', async () => {
    setup({
      isSchedulesEnabled: true,
      searchAttributes: { CadenceScheduleID: 'schedule-id' },
    });

    expect(await screen.findByRole('cell', { name: '-' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'No' })).toBeInTheDocument();
  });

  it('links backfill IDs to the filtered workflows list', async () => {
    setup({
      isSchedulesEnabled: true,
      domain: 'test/domain',
      cluster: 'test cluster',
      searchAttributes: {
        CadenceScheduleID: 'schedule-id',
        CadenceScheduleIsBackfill: true,
        CadenceScheduleBackfillID: 'backfill-id',
      },
    });

    expect(
      await screen.findByRole('cell', { name: 'Yes' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'backfill-id' })).toHaveAttribute(
      'href',
      `/domains/test%2Fdomain/test%20cluster/workflows?input=query&query=${encodeURIComponent(
        'CadenceScheduleBackfillID="backfill-id"'
      )}`
    );
  });
});

function setup({
  isSchedulesEnabled,
  ...props
}: Partial<Props> & { isSchedulesEnabled: boolean }) {
  render(
    <WorkflowSummaryScheduleDetails
      cluster="test-cluster"
      domain="test-domain"
      {...props}
    />,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => HttpResponse.json(isSchedulesEnabled),
        },
      ],
    }
  );
}
