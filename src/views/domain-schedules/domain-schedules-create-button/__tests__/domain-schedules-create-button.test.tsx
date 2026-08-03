import React from 'react';

import { waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import { type ScheduleActionEnabledConfigValue } from '@/config/dynamic/resolvers/schedule-actions-enabled.types';
import mockResolvedConfigValues from '@/utils/config/__fixtures__/resolved-config-values';
import getActionDisabledReason from '@/views/schedule-actions/schedule-actions-menu/helpers/get-action-disabled-reason';

import DomainSchedulesCreateButton from '../domain-schedules-create-button';
import { type Props } from '../domain-schedules-create-button.types';

jest.mock('@/components/button/button', () =>
  jest.fn((props) => {
    return (
      <button onClick={props.onClick} data-testid="create-schedule-button">
        {JSON.stringify({
          isLoading: props.isLoading,
          disabled: props.disabled,
        })}
      </button>
    );
  })
);

jest.mock('baseui/tooltip', () => {
  return {
    ...jest.requireActual('baseui/tooltip'),
    StatefulTooltip: jest.fn((props) => {
      return (
        <>
          <div data-testid="tooltip">{props.content}</div>
          {props.children}
        </>
      );
    }),
  };
});

jest.mock(
  '@/views/schedule-actions/schedule-actions-menu/helpers/get-action-disabled-reason'
);

const mockGetActionDisabledReason = getActionDisabledReason as jest.Mock;

describe(DomainSchedulesCreateButton.name, () => {
  const defaultProps: Props = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetActionDisabledReason.mockReturnValue(undefined);
  });

  it('renders the create schedule button', async () => {
    await setup(defaultProps);

    expect(screen.getByTestId('create-schedule-button')).toBeInTheDocument();
  });

  it('calls getActionDisabledReason with correct parameters', async () => {
    setup(defaultProps, {
      startActionEnabledConfig: 'ENABLED',
    });

    await waitFor(() => {
      expect(mockGetActionDisabledReason).toHaveBeenCalledWith({
        actionEnabledConfig: 'ENABLED',
        actionRunnableStatus: 'RUNNABLE',
      });
    });
  });

  it('should pass isConfigLoading to the button', async () => {
    setup(defaultProps, {
      isConfigLoading: true,
    });

    expect(screen.getByTestId('create-schedule-button')).toHaveTextContent(
      /"isLoading":true/
    );
  });

  it('disables button when action is disabled', async () => {
    mockGetActionDisabledReason.mockReturnValue(
      'Schedule action has been disabled'
    );

    await setup(defaultProps);

    expect(screen.getByTestId('create-schedule-button')).toHaveTextContent(
      /"disabled":true/
    );
  });

  it('shows tooltip with disabled reason when button is disabled', async () => {
    const disabledReason = 'Not authorized to perform this action';
    mockGetActionDisabledReason.mockReturnValue(disabledReason);

    setup(defaultProps);

    expect(screen.getByTestId('tooltip')).toHaveTextContent(disabledReason);
  });

  it('calls onClick when button is clicked', async () => {
    const onClick = jest.fn();
    const { user } = await setup(
      { ...defaultProps, onClick },
      {
        startActionEnabledConfig: 'ENABLED',
        isConfigLoading: false,
        isConfigError: false,
      }
    );

    await user.click(screen.getByTestId('create-schedule-button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when user lacks domain write access', async () => {
    mockGetActionDisabledReason.mockImplementation(
      ({
        actionEnabledConfig,
      }: {
        actionEnabledConfig?: ScheduleActionEnabledConfigValue;
      }) =>
        actionEnabledConfig === 'DISABLED_UNAUTHORIZED'
          ? 'Not authorized'
          : undefined
    );

    await setup(defaultProps, {
      startActionEnabledConfig: 'DISABLED_UNAUTHORIZED',
    });

    await waitFor(() => {
      expect(mockGetActionDisabledReason).toHaveBeenCalledWith({
        actionEnabledConfig: 'DISABLED_UNAUTHORIZED',
        actionRunnableStatus: 'RUNNABLE',
      });
    });

    expect(screen.getByTestId('create-schedule-button')).toHaveTextContent(
      /"disabled":true/
    );
    expect(screen.getByTestId('tooltip')).toHaveTextContent('Not authorized');
  });

  it('show loading indicator when config errors', async () => {
    await setup(defaultProps, {
      isConfigError: true,
    });

    expect(screen.getByTestId('create-schedule-button')).toHaveTextContent(
      /"isLoading":true/
    );
  });
});

function setup(
  props: Props,
  options: {
    startActionEnabledConfig?: ScheduleActionEnabledConfigValue;
    isConfigLoading?: boolean;
    isConfigError?: boolean;
  } = {}
) {
  const user = userEvent.setup();
  const {
    startActionEnabledConfig = mockResolvedConfigValues.SCHEDULE_ACTIONS_ENABLED
      .start,
    isConfigLoading = false,
    isConfigError = false,
  } = options;

  const renderResult = render(<DomainSchedulesCreateButton {...props} />, {
    endpointsMocks: [
      {
        path: '/api/config',
        httpMethod: 'GET',
        mockOnce: false,
        httpResolver: async () => {
          if (isConfigError) {
            return HttpResponse.json(
              { error: 'Config error' },
              { status: 500 }
            );
          }
          if (isConfigLoading) {
            return new Promise(() => {});
          }

          return HttpResponse.json({
            ...mockResolvedConfigValues.SCHEDULE_ACTIONS_ENABLED,
            start: startActionEnabledConfig,
          });
        },
      },
    ],
  });

  return {
    user,
    ...renderResult,
  };
}
