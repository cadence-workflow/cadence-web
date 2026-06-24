import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { type CreateScheduleRequestBody } from '@/route-handlers/create-schedule/create-schedule.types';
import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';
import { type ModalProps } from 'baseui/modal';
import { HttpResponse } from 'msw';
import * as reactHookForm from 'react-hook-form';

import { mockDomainSchedulesCreateFormData } from '../__fixtures__/mock-domain-schedules-create-form-data';
import { type DomainSchedulesCreateFormData } from '../domain-schedules-create-modal.types';
import DomainSchedulesCreateModal from '../domain-schedules-create-modal';

const { useForm: useFormActual } =
  jest.requireActual<typeof reactHookForm>('react-hook-form');

const MOCK_DOMAIN = 'd1';
const MOCK_CLUSTER = 'c1';

const mockEnqueue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: jest.fn(),
  }),
}));

jest.mock('baseui/modal', () => ({
  ...jest.requireActual('baseui/modal'),
  Modal: ({ isOpen, children }: ModalProps) =>
    isOpen ? (
      <div aria-modal aria-label="dialog" role="dialog">
        {typeof children === 'function' ? children() : children}
      </div>
    ) : null,
}));

describe(DomainSchedulesCreateModal.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(reactHookForm, 'useForm').mockImplementation((options) =>
      useFormActual({
        ...options,
        defaultValues: {
          ...(options?.defaultValues as DomainSchedulesCreateFormData),
          ...mockDomainSchedulesCreateFormData,
        },
      })
    );
    HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders when open and hides when closed', () => {
    const { rerender } = setup({ isOpen: true });

    expect(screen.getByText('Create Schedule')).toBeInTheDocument();
    rerender(
      <DomainSchedulesCreateModal
        domain={MOCK_DOMAIN}
        cluster={MOCK_CLUSTER}
        isOpen={false}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('submits, shows a success snackbar, and closes on success', async () => {
    const { user, mockOnClose, getLatestRequestBody } = setup({ isOpen: true });

    await user.click(screen.getByRole('button', { name: 'Create schedule' }));

    await waitFor(() => {
      expect(getLatestRequestBody()).toEqual(
        expect.objectContaining({
          cronExpression: '0 9 * * *',
          startWorkflow: expect.objectContaining({
            workflowType: { name: 'DemoWorkflow' },
          }),
          overlapPolicy:
            ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT,
        })
      );
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({ actionMessage: 'OK' })
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('shows an error banner when createSchedule fails', async () => {
    const { user } = setup({
      isOpen: true,
      errorMessage: 'Failed to create schedule: duplicate ID',
      errorStatus: 409,
    });

    await user.click(screen.getByRole('button', { name: 'Create schedule' }));

    expect(
      await screen.findByText('Failed to create schedule: duplicate ID')
    ).toBeInTheDocument();
  });
});

function setup({
  isOpen,
  errorMessage,
  errorStatus,
}: {
  isOpen: boolean;
  errorMessage?: string;
  errorStatus?: number;
}) {
  const user = userEvent.setup();
  const mockOnClose = jest.fn();
  let latestRequestBody: CreateScheduleRequestBody | null = null;

  const view = render(
    <DomainSchedulesCreateModal
      domain={MOCK_DOMAIN}
      cluster={MOCK_CLUSTER}
      isOpen={isOpen}
      onClose={mockOnClose}
    />,
    {
      endpointsMocks: [
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/schedules`,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            latestRequestBody =
              (await request.json()) as CreateScheduleRequestBody;

            if (errorMessage !== undefined && errorStatus !== undefined) {
              return HttpResponse.json(
                { message: errorMessage },
                { status: errorStatus }
              );
            }

            return HttpResponse.json({ scheduleId: 'new-schedule-id' });
          },
        },
      ],
    }
  );

  return {
    user,
    mockOnClose,
    getLatestRequestBody: () => latestRequestBody,
    ...view,
  };
}
