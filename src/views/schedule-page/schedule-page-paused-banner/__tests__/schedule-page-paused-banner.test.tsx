import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import {
  getMockPausedDescribeScheduleResponse,
  getMockRunningDescribeScheduleResponse,
} from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type DescribeScheduleResponse } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

import formatPausedAtTimestamp from '../helpers/format-paused-at-timestamp';
import SchedulePagePausedBanner from '../schedule-page-paused-banner';

describe(SchedulePagePausedBanner.name, () => {
  it('shows paused banner with mailto link when schedule is paused', async () => {
    const pausedAt = { seconds: '1704112496', nanos: 0 };
    const response = getMockPausedDescribeScheduleResponse({
      state: {
        paused: true,
        pauseInfo: {
          pausedBy: 'operator@example.com',
          reason: 'Paused for maintenance',
          pausedAt,
        },
      },
    });

    setup({ response });

    expect(await screen.findByText(/Schedule was paused/)).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes(formatPausedAtTimestamp(pausedAt)!)
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'operator@example.com' })).toHaveAttribute(
      'href',
      'mailto:operator@example.com'
    );
    expect(document.body.textContent).toMatch(/Reason: "Paused for maintenance"/);
  });

  it('omits unknown pause details when pause info is missing', async () => {
    const response = getMockPausedDescribeScheduleResponse({
      state: {
        paused: true,
        pauseInfo: {
          pausedBy: '',
          reason: '',
          pausedAt: null,
        },
      },
    });

    setup({ response });

    expect(await screen.findByText('Schedule was paused')).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/Unknown/);
    expect(document.body.textContent).not.toMatch(/Reason:/);
  });

  it('does not render when schedule is running', async () => {
    setup({ response: getMockRunningDescribeScheduleResponse() });

    await waitFor(() => {
      expect(screen.queryByText(/Schedule was paused/)).not.toBeInTheDocument();
    });
  });
});

function setup({
  response = getMockRunningDescribeScheduleResponse(),
}: {
  response?: DescribeScheduleResponse;
}) {
  return render(
    <Suspense fallback={null}>
      <SchedulePagePausedBanner
        domain="test-domain"
        cluster="test-cluster"
        scheduleId="test-schedule"
      />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/schedules/:scheduleId',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: () => HttpResponse.json(response),
        },
      ],
    }
  );
}
