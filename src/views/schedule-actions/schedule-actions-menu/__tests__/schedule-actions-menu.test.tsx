import React from 'react';

import { render, screen, userEvent, within } from '@/test-utils/rtl';

import {
  type ScheduleActionEnabledConfigValue,
  type ScheduleActionsEnabledConfig,
} from '@/config/dynamic/resolvers/schedule-actions-enabled.types';
import { mockDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import mockResolvedConfigValues from '@/utils/config/__fixtures__/resolved-config-values';

import { mockScheduleActionsConfig } from '../../__fixtures__/schedule-actions-config';
import ScheduleActionsMenu from '../schedule-actions-menu';

jest.mock(
  '../../config/schedule-actions.config',
  () => mockScheduleActionsConfig
);

jest.mock('../helpers/get-action-disabled-reason', () =>
  jest.fn(
    ({
      actionEnabledConfig,
    }: {
      actionEnabledConfig?: ScheduleActionEnabledConfigValue;
    }) =>
      actionEnabledConfig === 'ENABLED'
        ? undefined
        : 'Mock schedule action disabled reason'
  )
);

describe(ScheduleActionsMenu.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the menu items correctly', () => {
    setup({
      actionsEnabledConfig: mockResolvedConfigValues.SCHEDULE_ACTIONS_ENABLED,
    });

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons).toHaveLength(2);

    expect(within(menuButtons[0]).getByText('Mock pause')).toBeInTheDocument();
    expect(
      within(menuButtons[0]).getByText('Mock pause a schedule')
    ).toBeInTheDocument();
    expect(menuButtons[0]).not.toBeDisabled();

    expect(within(menuButtons[1]).getByText('Mock resume')).toBeInTheDocument();
    expect(
      within(menuButtons[1]).getByText('Mock resume a schedule')
    ).toBeInTheDocument();
    expect(menuButtons[1]).not.toBeDisabled();
  });

  it('disables menu items and shows tooltip if they are disabled from config', async () => {
    const { user } = setup({
      actionsEnabledConfig: {
        pause: 'DISABLED_DEFAULT',
        resume: 'DISABLED_DEFAULT',
        backfill: 'DISABLED_DEFAULT',
      },
    });

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons[0]).toBeDisabled();
    expect(menuButtons[1]).toBeDisabled();

    await user.hover(menuButtons[0]);
    expect(
      await screen.findByText('Mock schedule action disabled reason')
    ).toBeInTheDocument();
  });

  it('disables menu items if no config is passed', () => {
    setup({ actionsEnabledConfig: undefined });

    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons[0]).toBeDisabled();
    expect(menuButtons[1]).toBeDisabled();
  });

  it('calls onActionSelect when an enabled action button is clicked', async () => {
    const { user, mockOnActionSelect } = setup({
      actionsEnabledConfig: mockResolvedConfigValues.SCHEDULE_ACTIONS_ENABLED,
    });

    await user.click(screen.getAllByRole('button')[0]);
    expect(mockOnActionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'pause' })
    );
  });
});

function setup({
  schedule = mockDescribeScheduleResponse,
  actionsEnabledConfig,
}: {
  schedule?: typeof mockDescribeScheduleResponse | undefined;
  actionsEnabledConfig?: ScheduleActionsEnabledConfig;
}) {
  const user = userEvent.setup();
  const mockOnActionSelect = jest.fn();

  render(
    <ScheduleActionsMenu
      schedule={schedule}
      {...(actionsEnabledConfig && { actionsEnabledConfig })}
      onActionSelect={mockOnActionSelect}
    />
  );

  return { user, mockOnActionSelect };
}
