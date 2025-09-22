import React from 'react';

import { render, screen, userEvent, within } from '@/test-utils/rtl';

import {
  type WorkflowActionEnabledConfigValue,
  type WorkflowActionsEnabledConfig,
} from '@/config/dynamic/resolvers/workflow-actions-enabled.types';
import mockResolvedConfigValues from '@/utils/config/__fixtures__/resolved-config-values';
import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import { mockWorkflowActionsConfig } from '../../__fixtures__/workflow-actions-config';
import WorkflowActionsMenu from '../workflow-actions-menu';

jest.mock(
  '../../config/workflow-actions.config',
  () => mockWorkflowActionsConfig
);

jest.mock('../helpers/get-action-disabled-reason', () =>
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

describe(WorkflowActionsMenu.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the menu items correctly', () => {
    setup({
      actionsEnabledConfig: mockResolvedConfigValues.WORKFLOW_ACTIONS_ENABLED,
    });

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons).toHaveLength(3);

    expect(within(menuButtons[0]).getByText('Mock cancel')).toBeInTheDocument();
    expect(
      within(menuButtons[0]).getByText('Mock cancel a workflow execution')
    ).toBeInTheDocument();
    expect(menuButtons[0]).not.toBeDisabled();

    expect(
      within(menuButtons[1]).getByText('Mock terminate')
    ).toBeInTheDocument();
    expect(
      within(menuButtons[1]).getByText('Mock terminate a workflow execution')
    ).toBeInTheDocument();
    expect(menuButtons[1]).not.toBeDisabled();
  });

  it('disables menu items and shows popover if they are disabled from config', async () => {
    const { user } = setup({
      actionsEnabledConfig: {
        cancel: 'DISABLED_DEFAULT',
        terminate: 'DISABLED_DEFAULT',
        signal: 'DISABLED_DEFAULT',
        restart: 'ENABLED',
        reset: 'ENABLED',
        start: 'DISABLED_DEFAULT',
      },
    });

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons).toHaveLength(3);

    expect(within(menuButtons[0]).getByText('Mock cancel')).toBeInTheDocument();
    expect(
      within(menuButtons[0]).getByText('Mock cancel a workflow execution')
    ).toBeInTheDocument();
    expect(menuButtons[0]).toBeDisabled();

    expect(
      within(menuButtons[1]).getByText('Mock terminate')
    ).toBeInTheDocument();
    expect(
      within(menuButtons[1]).getByText('Mock terminate a workflow execution')
    ).toBeInTheDocument();
    expect(menuButtons[1]).toBeDisabled();

    await user.hover(menuButtons[0]);
    expect(
      await screen.findByText('Mock workflow action disabled reason')
    ).toBeInTheDocument();
  });

  it('disables menu items if no config is passed', () => {
    setup({
      actionsEnabledConfig: undefined,
    });

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons).toHaveLength(3);

    expect(within(menuButtons[0]).getByText('Mock cancel')).toBeInTheDocument();
    expect(
      within(menuButtons[0]).getByText('Mock cancel a workflow execution')
    ).toBeInTheDocument();
    expect(menuButtons[0]).toBeDisabled();

    expect(
      within(menuButtons[1]).getByText('Mock terminate')
    ).toBeInTheDocument();
    expect(
      within(menuButtons[1]).getByText('Mock terminate a workflow execution')
    ).toBeInTheDocument();
    expect(menuButtons[1]).toBeDisabled();
  });

  it('calls onActionSelect when the action button is clicked', async () => {
    const { user, mockOnActionSelect } = setup({
      actionsEnabledConfig: mockResolvedConfigValues.WORKFLOW_ACTIONS_ENABLED,
    });

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons).toHaveLength(3);

    await user.click(menuButtons[0]);
    expect(mockOnActionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'cancel' })
    );
  });
});

function setup({
  actionsEnabledConfig,
}: {
  actionsEnabledConfig?: WorkflowActionsEnabledConfig;
}) {
  const user = userEvent.setup();
  const mockOnActionSelect = jest.fn();

  const renderResult = render(
    <WorkflowActionsMenu
      workflow={mockDescribeWorkflowResponse}
      {...(actionsEnabledConfig && { actionsEnabledConfig })}
      onActionSelect={mockOnActionSelect}
    />
  );

  return { user, mockOnActionSelect, renderResult };
}
