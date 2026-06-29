import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import {
  getMockPausedDescribeScheduleResponse,
  getMockRunningDescribeScheduleResponse,
} from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type DescribeScheduleResponse } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

import { formatScheduleTimestamp } from '../../helpers/format-schedule-timestamp';

import ScheduleDetailsPausedBanner from '../schedule-details-paused-banner';

describe(ScheduleDetailsPausedBanner.name, () => {
  it('shows paused banner when schedule is paused', async () => {
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
        content.includes(formatScheduleTimestamp(pausedAt)!)
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/operator@example.com/)).toBeInTheDocument();
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
      <ScheduleDetailsPausedBanner
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
