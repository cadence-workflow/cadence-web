import React from 'react';

import { render, screen, userEvent, within } from '@/test-utils/rtl';

import { describeWorkflowResponse } from '../../__fixtures__/describe-workflow-response';
import { mockWorkflowPageActionsConfig } from '../../__fixtures__/workflow-actions-config';
import WorkflowPageActionsMenu from '../workflow-page-actions-menu';

jest.mock(
  '../../config/workflow-page-actions.config',
  () => mockWorkflowPageActionsConfig
);

describe(WorkflowPageActionsMenu.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the menu items correctly', () => {
    setup();

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

  it('calls onActionSelect when the action button is clicked', async () => {
    const { user, mockOnActionSelect } = setup();

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons).toHaveLength(2);

    await user.click(menuButtons[0]);
    expect(mockOnActionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'cancel' })
    );
  });
});

function setup() {
  const user = userEvent.setup();
  const mockOnActionSelect = jest.fn();

  const renderResult = render(
    <WorkflowPageActionsMenu
      workflow={describeWorkflowResponse}
      onActionSelect={mockOnActionSelect}
    />
  );

  return { user, mockOnActionSelect, renderResult };
}
