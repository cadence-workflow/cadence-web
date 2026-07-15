import { HttpResponse } from 'msw';
import { MdHistory } from 'react-icons/md';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { type BackfillScheduleResponse } from '@/route-handlers/backfill-schedule/backfill-schedule.types';

import transformBackfillScheduleFormToSubmission from '../../schedule-action-backfill-form/helpers/transform-backfill-schedule-form-to-submission';
import { backfillScheduleFormSchema } from '../../schedule-action-backfill-form/schemas/backfill-schedule-form-schema';
import {
  type BackfillScheduleSubmissionData,
  type ScheduleAction,
} from '../../schedule-actions.types';
import ScheduleActionsModalContent from '../schedule-actions-modal-content';

const mockScheduleParams = {
  domain: 'mock-domain',
  cluster: 'mock-cluster',
  scheduleId: 'mock-schedule-id',
};

const mockBackfillActionConfig: ScheduleAction<
  BackfillScheduleResponse,
  {
    backfillId?: string;
    startTime: string;
    endTime: string;
    overlapPolicy?: string;
  },
  BackfillScheduleSubmissionData
> = {
  id: 'backfill',
  label: 'Backfill',
  subtitle: 'Backfill missed workflow runs',
  modal: {
    withForm: true,
    form: ({ control }) => (
      <div data-testid="mock-backfill-form">
        <input
          data-testid="mock-backfill-id"
          aria-label="Backfill ID"
          {...control.register('backfillId')}
        />
        <input
          data-testid="mock-backfill-start-time"
          aria-label="Start time"
          {...control.register('startTime')}
        />
        <input
          data-testid="mock-backfill-end-time"
          aria-label="End time"
          {...control.register('endTime')}
        />
        <input
          data-testid="mock-backfill-overlap-policy"
          aria-label="Overlap policy"
          {...control.register('overlapPolicy')}
        />
      </div>
    ),
    formSchema: backfillScheduleFormSchema,
    transformFormDataToSubmission: transformBackfillScheduleFormToSubmission,
  },
  icon: MdHistory,
  getRunnableStatus: () => 'RUNNABLE',
  apiRoute: (params) =>
    `/api/domains/${encodeURIComponent(params.domain)}/${encodeURIComponent(params.cluster)}/schedules/${encodeURIComponent(params.scheduleId)}/backfill`,
  renderSuccessMessage: () => 'Schedule backfill has been started.',
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
    const { user, getLatestRequestBody, waitForRequest } = setup();

    await user.type(
      screen.getByTestId('mock-backfill-id'),
      'custom-backfill-id'
    );
    await user.type(
      screen.getByTestId('mock-backfill-start-time'),
      '2026-01-01T00:00:00.000Z'
    );
    await user.type(
      screen.getByTestId('mock-backfill-end-time'),
      '2026-01-02T00:00:00.000Z'
    );
    await user.type(
      screen.getByTestId('mock-backfill-overlap-policy'),
      String(ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER)
    );

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

function setup() {
  const user = userEvent.setup();
  const mockOnClose = jest.fn();
  let latestRequestBody: unknown = null;
  let requestPromiseResolve: (value: unknown) => void = () => undefined;
  const requestPromise = new Promise((resolve) => {
    requestPromiseResolve = resolve;
  });

  render(
    <ScheduleActionsModalContent
      action={mockBackfillActionConfig}
      params={{ ...mockScheduleParams }}
      onCloseModal={mockOnClose}
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
