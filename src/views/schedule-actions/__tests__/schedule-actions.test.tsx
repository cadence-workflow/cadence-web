import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { mockDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import { mockScheduleActionsConfig } from '../__fixtures__/schedule-actions-config';
import ScheduleActions from '../schedule-actions';

const mockScheduleParams = {
  domain: 'mock-domain',
  cluster: 'mock-cluster',
  scheduleId: 'mock-schedule-id',
};

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => mockScheduleParams,
}));

jest.mock('../schedule-actions-modal/schedule-actions-modal', () =>
  jest.fn((props) => {
    return props.action ? (
      <div data-testid="actions-modal">Actions Modal</div>
    ) : null;
  })
);

jest.mock('../schedule-actions-menu/schedule-actions-menu', () =>
  jest.fn((props) => {
    const areAllActionsDisabled = props.actionsEnabledConfig
      ? Object.entries(props.actionsEnabledConfig).every(
          ([_, value]) => value !== 'ENABLED'
        )
      : true;

    return (
      <div
        onClick={() => props.onActionSelect(mockScheduleActionsConfig[0])}
        data-testid="actions-menu"
      >
        Actions Menu{areAllActionsDisabled ? ' (disabled)' : ''}
      </div>
    );
  })
);

describe(ScheduleActions.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the button with the correct text', async () => {
    setup({});

    const actionsButton = await screen.findByRole('button');
    expect(actionsButton).toHaveAttribute(
      'aria-label',
      expect.stringContaining('loading')
    );

    await waitFor(() => {
      expect(actionsButton).not.toHaveAttribute(
        'aria-label',
        expect.stringContaining('loading')
      );
    });

    expect(actionsButton).toHaveTextContent('Schedule Actions');
  });

  it('renders the menu when the button is clicked', async () => {
    const { user } = setup({});

    const actionsButton = await screen.findByRole('button');
    await user.click(actionsButton);

    expect(await screen.findByTestId('actions-menu')).toBeInTheDocument();
  });

  it('renders the button with disabled configs if config fetching fails', async () => {
    const { user } = setup({ isConfigError: true });

    const actionsButton = await screen.findByRole('button');
    await user.click(actionsButton);

    const actionsMenu = await screen.findByTestId('actions-menu');
    expect(actionsMenu).toBeInTheDocument();
    expect(actionsMenu).toHaveTextContent('Actions Menu (disabled)');
  });

  it('shows the modal when a menu option is clicked', async () => {
    const { user } = setup({});

    const actionsButton = await screen.findByRole('button');
    await user.click(actionsButton);
    await user.click(await screen.findByTestId('actions-menu'));

    expect(await screen.findByTestId('actions-modal')).toBeInTheDocument();
  });

  it('renders nothing if describeSchedule fails', async () => {
    setup({ isError: true });

    await waitFor(() => {
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});

function setup({
  isError = false,
  isConfigError = false,
}: {
  isError?: boolean;
  isConfigError?: boolean;
}) {
  const user = userEvent.setup();

  render(<ScheduleActions />, {
    endpointsMocks: [
      {
        path: '/api/domains/:domain/:cluster/schedules/:scheduleId',
        httpMethod: 'GET',
        mockOnce: false,
        httpResolver: () => {
          if (isError) {
            return HttpResponse.json(
              { message: 'Schedule not found' },
              { status: 404 }
            );
          }

          return HttpResponse.json(mockDescribeScheduleResponse);
        },
      },
      {
        path: '/api/config',
        httpMethod: 'GET',
        mockOnce: false,
        httpResolver: () => {
          if (isConfigError) {
            return HttpResponse.json(
              { message: 'Failed to fetch config' },
              { status: 500 }
            );
          }

          return HttpResponse.json(
            {
              pause: 'ENABLED',
              resume: 'ENABLED',
              delete: 'ENABLED',
            },
            { status: 200 }
          );
        },
      },
    ],
  });

  return { user };
}
