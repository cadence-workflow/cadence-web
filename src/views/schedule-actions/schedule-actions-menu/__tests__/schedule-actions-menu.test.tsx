import React from 'react';

import { render, screen, userEvent, within } from '@/test-utils/rtl';
import {
  getMockPausedDescribeScheduleResponse,
  getMockRunningDescribeScheduleResponse,
  mockDescribeScheduleResponse,
} from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import { mockScheduleActionsConfig } from '../../__fixtures__/schedule-actions-config';
import ScheduleActionsMenu from '../schedule-actions-menu';

jest.mock(
  '../../config/schedule-actions.config',
  () => mockScheduleActionsConfig
);

describe(ScheduleActionsMenu.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the menu items correctly', () => {
    setup({ schedule: mockDescribeScheduleResponse });

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons).toHaveLength(2);

    expect(within(menuButtons[0]).getByText('Mock pause')).toBeInTheDocument();
    expect(menuButtons[0]).not.toBeDisabled();

    expect(within(menuButtons[1]).getByText('Mock resume')).toBeInTheDocument();
    expect(menuButtons[1]).toBeDisabled();
  });

  it('disables pause and enables resume when schedule is paused', () => {
    setup({ schedule: getMockPausedDescribeScheduleResponse() });

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons[0]).toBeDisabled();
    expect(menuButtons[1]).not.toBeDisabled();
  });

  it('shows tooltip when pause is disabled for a paused schedule', async () => {
    const { user } = setup({
      schedule: getMockPausedDescribeScheduleResponse(),
    });

    await user.hover(screen.getAllByRole('button')[0]);
    expect(
      await screen.findByText('Schedule is already paused')
    ).toBeInTheDocument();
  });

  it('shows tooltip when resume is disabled for a running schedule', async () => {
    const { user } = setup({
      schedule: getMockRunningDescribeScheduleResponse(),
    });

    await user.hover(screen.getAllByRole('button')[1]);
    expect(
      await screen.findByText('Schedule is not paused')
    ).toBeInTheDocument();
  });

  it('disables all actions while schedule is loading', () => {
    setup({ schedule: undefined });

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons[0]).toBeDisabled();
    expect(menuButtons[1]).toBeDisabled();
  });

  it('shows tooltip while schedule is loading', async () => {
    const { user } = setup({ schedule: undefined });

    await user.hover(screen.getAllByRole('button')[0]);
    expect(
      await screen.findByText('Loading schedule...')
    ).toBeInTheDocument();
  });

  it('calls onActionSelect when an enabled action button is clicked', async () => {
    const { user, mockOnActionSelect } = setup({
      schedule: mockDescribeScheduleResponse,
    });

    await user.click(screen.getAllByRole('button')[0]);
    expect(mockOnActionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'pause' })
    );
  });
});

function setup({
  schedule,
}: {
  schedule: typeof mockDescribeScheduleResponse | undefined;
}) {
  const user = userEvent.setup();
  const mockOnActionSelect = jest.fn();

  render(
    <ScheduleActionsMenu
      schedule={schedule}
      onActionSelect={mockOnActionSelect}
    />
  );

  return { user, mockOnActionSelect };
}
