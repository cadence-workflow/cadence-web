import React from 'react';

import { waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { HttpResponse } from 'msw';

import { render, screen } from '@/test-utils/rtl';

import { type WorkflowActionEnabledConfigValue } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';
import mockResolvedConfigValues from '@/utils/config/__fixtures__/resolved-config-values';
import {
  mockWorkflowActionsConfig,
  mockStartActionConfig,
} from '@/views/workflow-actions/__fixtures__/workflow-actions-config';
import getActionDisabledReason from '@/views/workflow-actions/workflow-actions-menu/helpers/get-action-disabled-reason';

import DomainPageStartWorkflowButton from '../domain-page-start-workflow-button';
import type { Props } from '../domain-page-start-workflow-button.types';

jest.mock('../../../workflow-actions/config/workflow-actions.config', () => {
  return {
    default: mockWorkflowActionsConfig,
    startWorkflowActionConfig: mockStartActionConfig,
  };
});

jest.mock('@/components/button/button', () =>
  jest.fn((props) => {
    return (
      <button onClick={props.onClick} data-testid="start-workflow-button">
        {JSON.stringify({
          isLoading: props.isLoading,
          disabled: props.disabled,
        })}
      </button>
    );
  })
);

// mock StatefulTooltip
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
  '../../../workflow-actions/workflow-actions-menu/helpers/get-action-disabled-reason',
  () =>
    jest.fn(
      ({
        actionEnabledConfig,
      }: {
        actionEnabledConfig?: WorkflowActionEnabledConfigValue;
      }) =>
        actionEnabledConfig === 'ENABLED'
          ? undefined
          : 'Mock workflow action disabled reason'
    )
);
jest.mock(
  '../../../workflow-actions/workflow-actions-modal/workflow-actions-modal',
  () =>
    jest.fn((props) => {
      return (
        <div data-testid="actions-modal">
          Actions Modal
          <button data-testid="close-modal-button" onClick={props.onClose}>
            Close
          </button>
        </div>
      );
    })
);

jest.mock(
  '@/views/workflow-actions/workflow-actions-menu/helpers/get-action-disabled-reason'
);
const mockGetActionDisabledReason = getActionDisabledReason as jest.Mock;

describe('DomainPageStartWorkflowButton', () => {
  const defaultProps: Props = {
    domain: 'test-domain',
    cluster: 'test-cluster',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetActionDisabledReason.mockReturnValue(undefined);
  });

  it('renders the start workflow button', async () => {
    await setup(defaultProps);

    const button = screen.getByTestId('start-workflow-button');
    expect(button).toBeInTheDocument();
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
    expect(screen.getByTestId('start-workflow-button')).toHaveTextContent(
      /"isLoading":true/
    );
  });

  it('disables button when action is disabled', async () => {
    const disabledReason = 'Workflow action has been disabled';
    mockGetActionDisabledReason.mockReturnValue(disabledReason);

    await setup(defaultProps);

    const button = screen.getByTestId('start-workflow-button');
    expect(button).toHaveTextContent(/"disabled":true/);
  });

  it('shows tooltip with disabled reason when button is disabled', async () => {
    const disabledReason = 'Not authorized to perform this action';
    mockGetActionDisabledReason.mockReturnValue(disabledReason);

    setup(defaultProps);
    expect(screen.getByTestId('tooltip')).toHaveTextContent(disabledReason);
  });

  it('opens modal when button is clicked', async () => {
    const { user } = await setup(defaultProps, {
      startActionEnabledConfig: 'ENABLED',
      isConfigLoading: false,
      isConfigError: false,
    });

    const button = screen.getByTestId('start-workflow-button');
    expect(screen.queryByTestId('actions-modal')).not.toBeInTheDocument();
    await user.click(button);

    expect(screen.getByTestId('actions-modal')).toBeInTheDocument();
  });

  it('closes modal when onClose is called', async () => {
    const { user } = await setup(defaultProps);

    const button = screen.getByTestId('start-workflow-button');
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(screen.getByTestId('actions-modal')).toBeInTheDocument();
    await user.click(screen.getByTestId('close-modal-button'));

    expect(screen.queryByTestId('actions-modal')).not.toBeInTheDocument();
  });

  it('show loading indicator when config errors', async () => {
    await setup(defaultProps, {
      isConfigError: true,
    });

    const button = screen.getByTestId('start-workflow-button');
    expect(button).toHaveTextContent(/"isLoading":true/);
  });
});

function setup(
  props: Props,
  options: {
    startActionEnabledConfig?: string;
    isConfigLoading?: boolean;
    isConfigError?: boolean;
  } = {}
) {
  const user = userEvent.setup();
  const {
    startActionEnabledConfig = mockResolvedConfigValues.WORKFLOW_ACTIONS_ENABLED
      .start,
    isConfigLoading = false,
    isConfigError = false,
  } = options;

  const renderResult = render(<DomainPageStartWorkflowButton {...props} />, {
    endpointsMocks: [
      {
        path: '/api/config',
        httpMethod: 'GET',
        mockOnce: true,
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

          const response = {
            ...mockResolvedConfigValues.WORKFLOW_ACTIONS_ENABLED,
            start: startActionEnabledConfig,
          };
          return HttpResponse.json(response);
        },
      },
    ],
  });

  return {
    user,
    ...renderResult,
  };
}
