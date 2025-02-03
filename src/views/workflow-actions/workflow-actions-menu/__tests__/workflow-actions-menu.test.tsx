import React from 'react';

import { render, screen, userEvent, within } from '@/test-utils/rtl';

import { type WorkflowActionsEnabledConfig } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';
import { describeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import { mockWorkflowActionsConfig } from '../../__fixtures__/workflow-actions-config';
import WorkflowActionsMenu from '../workflow-actions-menu';

jest.mock(
  '../../config/workflow-actions.config',
  () => mockWorkflowActionsConfig
);

describe(WorkflowActionsMenu.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the menu items correctly', () => {
    setup({});

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons).toHaveLength(2);

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
    expect(menuButtons[1]).toBeDisabled();
  });

  it('disables menu items if they are disabled from config', () => {
    setup({
      actionsEnabledConfigOverrides: { terminate: true, cancel: false },
    });

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons).toHaveLength(2);

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
    const { user, mockOnActionSelect } = setup({});

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons).toHaveLength(2);

    await user.click(menuButtons[0]);
    expect(mockOnActionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'cancel' })
    );
  });
});

function setup({
  actionsEnabledConfigOverrides,
}: {
  actionsEnabledConfigOverrides?: Partial<WorkflowActionsEnabledConfig>;
}) {
  const user = userEvent.setup();
  const mockOnActionSelect = jest.fn();

  const renderResult = render(
    <WorkflowActionsMenu
      workflow={describeWorkflowResponse}
      actionsEnabledConfig={{
        terminate: true,
        cancel: true,
        ...actionsEnabledConfigOverrides,
      }}
      onActionSelect={mockOnActionSelect}
    />
  );

  return { user, mockOnActionSelect, renderResult };
}
