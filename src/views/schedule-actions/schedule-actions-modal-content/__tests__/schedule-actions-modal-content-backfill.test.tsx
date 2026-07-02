import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type BackfillScheduleResponse } from '@/route-handlers/backfill-schedule/backfill-schedule.types';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';

import scheduleActionsConfig from '../../config/schedule-actions.config';
import { type BackfillScheduleFormData } from '../../schedule-action-backfill-form/schedule-action-backfill-form.types';
import ScheduleActionsModalContent from '../schedule-actions-modal-content';

const mockScheduleParams = {
  domain: 'mock-domain',
  cluster: 'mock-cluster',
  scheduleId: 'mock-schedule-id',
};

const mockEnqueue = jest.fn();
const mockDequeue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: mockDequeue,
  }),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({ push: mockPush }),
}));

describe(`${ScheduleActionsModalContent.name} backfill`, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('submits backfill form with ISO date strings', async () => {
    const { user, getLatestRequestBody, waitForRequest } = setup({
      defaultValues: {
        backfillId: 'custom-backfill-id',
        startTime: '2026-01-01T00:00:00.000Z',
        endTime: '2026-01-02T00:00:00.000Z',
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
      },
    });

    await user.click(
      await screen.findByRole('button', { name: 'Backfill schedule' })
    );

    await waitForRequest();
    expect(getLatestRequestBody()).toEqual({
      backfillId: 'custom-backfill-id',
      startTime: '2026-01-01T00:00:00.000Z',
      endTime: '2026-01-02T00:00:00.000Z',
      overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
    });

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Schedule backfill has been started.',
        })
      );
    });
  });
});

function setup({
  defaultValues,
}: {
  defaultValues?: BackfillScheduleFormData;
}) {
  const user = userEvent.setup();
  const mockOnClose = jest.fn();
  let latestRequestBody: unknown = null;
  let requestPromiseResolve: (value: unknown) => void = () => undefined;
  const requestPromise = new Promise((resolve) => {
    requestPromiseResolve = resolve;
  });

  render(
    <ScheduleActionsModalContent
      action={scheduleActionsConfig[3]}
      params={{ ...mockScheduleParams }}
      onCloseModal={mockOnClose}
      initialFormValues={defaultValues}
    />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/schedules/:scheduleId/backfill',
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            const text = await request.text();
            latestRequestBody = text ? JSON.parse(text) : null;
            requestPromiseResolve(null);

            return HttpResponse.json({} satisfies BackfillScheduleResponse);
          },
        },
      ],
    }
  );

  return {
    user,
    mockOnClose,
    getLatestRequestBody: () => latestRequestBody,
    waitForRequest: () => requestPromise,
  };
}
