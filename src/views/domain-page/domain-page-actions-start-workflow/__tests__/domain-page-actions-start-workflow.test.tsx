import React from 'react';

import { type IconProps } from 'baseui/icon';
import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type WorkflowActionEnabledConfigValue } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';
import mockResolvedConfigValues from '@/utils/config/__fixtures__/resolved-config-values';
import * as getActionDisabledReasonModule from '@/views/workflow-actions/workflow-actions-menu/helpers/get-action-disabled-reason';

import { type DomainPageActionButtonProps } from '../../domain-page-actions-dropdown/domain-page-actions-dropdown.types';
import DomainPageActionsStartWorkflow from '../domain-page-actions-start-workflow';

function MockIcon({ size }: IconProps) {
  return <span data-testid="mock-icon" data-size={size} />;
}

jest.mock(
  '../../domain-page-base-action-button/domain-page-base-action-button',
  () =>
    jest.fn(
      ({
        label,
        onClick,
        disabledReason,
      }: {
        label: string;
        onClick: () => void;
        disabledReason?: string;
      }) => (
        <button
          type="button"
          onClick={onClick}
          disabled={Boolean(disabledReason)}
          aria-label={disabledReason ?? label}
          data-testid="domain-page-base-action-button"
        >
          {label}
        </button>
      )
    )
);

jest.mock(
  '@/views/workflow-actions/workflow-actions-menu/helpers/get-action-disabled-reason'
);

jest.mock(
  '@/views/workflow-actions/workflow-actions-modal/workflow-actions-modal',
  () =>
    jest.fn((props: { onClose: () => void }) => (
      <div data-testid="actions-modal">
        Actions Modal
        <button
          type="button"
          data-testid="close-modal-button"
          onClick={props.onClose}
        >
          Close
        </button>
      </div>
    ))
);

describe(DomainPageActionsStartWorkflow.name, () => {
  const defaultProps: DomainPageActionButtonProps = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    label: 'Start new workflow',
    icon: MockIcon,
    onCloseMenu: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the start workflow action button', async () => {
    setup(defaultProps, { startActionEnabledConfig: 'ENABLED' });

    expect(
      await screen.findByRole('button', { name: 'Start new workflow' })
    ).toBeInTheDocument();
  });

  it('calls getActionDisabledReason with correct parameters', async () => {
    const { getActionDisabledReasonSpy } = setup(defaultProps, {
      startActionEnabledConfig: 'ENABLED',
    });

    await waitFor(() => {
      expect(getActionDisabledReasonSpy).toHaveBeenCalledWith({
        actionEnabledConfig: 'ENABLED',
        actionRunnableStatus: 'RUNNABLE',
      });
    });
  });

  it('disables the button when the action is disabled', async () => {
    setup(defaultProps, {
      getActionDisabledReasonReturnValue:
        'Not authorized to perform this action',
    });

    expect(
      await screen.findByRole('button', {
        name: 'Not authorized to perform this action',
      })
    ).toBeDisabled();
  });

  it('disables the button with Action Unavailable when config is loading', async () => {
    setup(defaultProps, {
      isConfigLoading: true,
      getActionDisabledReasonReturnValue: undefined,
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Action Unavailable' })
      ).toBeDisabled();
    });
  });

  it('disables the button with Action Unavailable when config errors', async () => {
    setup(defaultProps, {
      isConfigError: true,
      getActionDisabledReasonReturnValue: undefined,
    });

    expect(
      await screen.findByRole('button', { name: 'Action Unavailable' })
    ).toBeDisabled();
  });

  it('opens the workflow actions modal when the button is clicked', async () => {
    const { user } = setup(defaultProps, {
      startActionEnabledConfig: 'ENABLED',
    });

    expect(screen.queryByTestId('actions-modal')).not.toBeInTheDocument();

    await user.click(
      await screen.findByRole('button', { name: 'Start new workflow' })
    );

    expect(screen.getByTestId('actions-modal')).toBeInTheDocument();
  });

  it('closes the workflow actions modal when onClose is called', async () => {
    const { user } = setup(defaultProps, {
      startActionEnabledConfig: 'ENABLED',
    });

    await user.click(
      await screen.findByRole('button', { name: 'Start new workflow' })
    );
    expect(screen.getByTestId('actions-modal')).toBeInTheDocument();

    await user.click(screen.getByTestId('close-modal-button'));

    expect(screen.queryByTestId('actions-modal')).not.toBeInTheDocument();
  });
});

function setup(
  props: DomainPageActionButtonProps,
  options: {
    startActionEnabledConfig?: WorkflowActionEnabledConfigValue;
    isConfigLoading?: boolean;
    isConfigError?: boolean;
    getActionDisabledReasonReturnValue?: string | undefined;
  } = {}
) {
  const user = userEvent.setup();
  const {
    startActionEnabledConfig = mockResolvedConfigValues.WORKFLOW_ACTIONS_ENABLED
      .start,
    isConfigLoading = false,
    isConfigError = false,
  } = options;

  const getActionDisabledReasonSpy = jest
    .spyOn(getActionDisabledReasonModule, 'default')
    .mockImplementation(
      ({
        actionEnabledConfig,
      }: {
        actionEnabledConfig?: WorkflowActionEnabledConfigValue;
      }) => {
        if ('getActionDisabledReasonReturnValue' in options) {
          return options.getActionDisabledReasonReturnValue;
        }

        return actionEnabledConfig === 'ENABLED'
          ? undefined
          : 'Mock workflow action disabled reason';
      }
    );

  const renderResult = render(<DomainPageActionsStartWorkflow {...props} />, {
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
            ...mockResolvedConfigValues.WORKFLOW_ACTIONS_ENABLED,
            start: startActionEnabledConfig,
          });
        },
      },
    ],
  });

  return {
    user,
    getActionDisabledReasonSpy,
    ...renderResult,
  };
}
