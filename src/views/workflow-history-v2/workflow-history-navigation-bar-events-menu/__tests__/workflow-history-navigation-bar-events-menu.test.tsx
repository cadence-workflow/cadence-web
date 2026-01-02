import { useState } from 'react';

import { type StatefulPopoverProps } from 'baseui/popover';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHistoryNavigationBarEventsMenu from '../workflow-history-navigation-bar-events-menu';
import { type Props } from '../workflow-history-navigation-bar-events-menu.types';

// Mock StatefulPopover to render content immediately in tests
jest.mock('baseui/popover', () => {
  const originalModule = jest.requireActual('baseui/popover');
  return {
    ...originalModule,
    StatefulPopover: ({ content, children }: StatefulPopoverProps) => {
      const [isShown, setIsShown] = useState(false);

      return (
        <div>
          <div onClick={() => setIsShown(true)}>{children}</div>
          {isShown ? (
            <div data-testid="popover-content">
              {typeof content === 'function' &&
                content({
                  close: () => {
                    setIsShown(false);
                  },
                })}
            </div>
          ) : null}
        </div>
      );
    },
  };
});

describe(WorkflowHistoryNavigationBarEventsMenu.name, () => {
  it('renders children', () => {
    setup();

    expect(screen.getByText('Open Popover')).toBeInTheDocument();
  });

  it('does not show popover content initially', () => {
    setup();

    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('renders all menu items when popover is opened', async () => {
    const { user } = setup({
      menuItems: [
        {
          eventId: 'event-1',
          label: 'Event 1',
          type: 'ACTIVITY',
        },
        {
          eventId: 'event-2',
          label: 'Event 2',
          type: 'DECISION',
        },
      ],
    });

    await user.click(screen.getByText('Open Popover'));

    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  it('calls onClickEvent and closes popover when menu item is clicked', async () => {
    const { user, mockOnClickEvent } = setup({
      menuItems: [
        {
          eventId: 'event-1',
          label: 'Event 1',
          type: 'ACTIVITY',
        },
      ],
    });

    await user.click(screen.getByText('Open Popover'));

    expect(screen.queryByTestId('popover-content')).toBeInTheDocument();
    const eventButton = screen.getByText('Event 1');
    await user.click(eventButton);

    expect(mockOnClickEvent).toHaveBeenCalledWith('event-1');
    expect(mockOnClickEvent).toHaveBeenCalledTimes(1);

    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('shows pagination when there are more than 10 items', async () => {
    const { user } = setup({
      menuItems: Array.from({ length: 15 }, (_, i) => ({
        eventId: `event-${i + 1}`,
        label: `Event ${i + 1}`,
        type: 'ACTIVITY',
      })),
    });

    await user.click(screen.getByText('Open Popover'));

    expect(screen.getByTestId('pagination-container')).toBeInTheDocument();
  });

  it('does not show pagination when there are 10 or fewer items', async () => {
    const { user } = setup({
      menuItems: Array.from({ length: 10 }, (_, i) => ({
        eventId: `event-${i + 1}`,
        label: `Event ${i + 1}`,
        type: 'ACTIVITY',
      })),
    });

    await user.click(screen.getByText('Open Popover'));

    expect(
      screen.queryByTestId('pagination-container')
    ).not.toBeInTheDocument();
  });

  it('shows first 10 items on initial page', async () => {
    const { user } = setup({
      menuItems: Array.from({ length: 15 }, (_, i) => ({
        eventId: `event-${i + 1}`,
        label: `Event ${i + 1}`,
        type: 'ACTIVITY',
      })),
    });

    await user.click(screen.getByText('Open Popover'));

    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 10')).toBeInTheDocument();
    expect(screen.queryByText('Event 11')).not.toBeInTheDocument();
  });

  it('shows correct items when pagination page is changed', async () => {
    const { user } = setup({
      menuItems: Array.from({ length: 15 }, (_, i) => ({
        eventId: `event-${i + 1}`,
        label: `Event ${i + 1}`,
        type: 'ACTIVITY',
      })),
    });

    await user.click(screen.getByText('Open Popover'));

    const nextPageButton = await screen.findByLabelText(/next page/i);
    await user.click(nextPageButton);

    expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
    expect(screen.getByText('Event 11')).toBeInTheDocument();
    expect(screen.getByText('Event 15')).toBeInTheDocument();
  });
});

function setup(overrides: Partial<Props> = {}) {
  const user = userEvent.setup();
  const mockOnClickEvent = jest.fn();

  render(
    <WorkflowHistoryNavigationBarEventsMenu
      isUngroupedHistoryView={false}
      menuItems={[
        {
          eventId: 'event-1',
          label: 'Event 1',
          type: 'ACTIVITY',
        },
      ]}
      onClickEvent={mockOnClickEvent}
      {...overrides}
    >
      <button>Open Popover</button>
    </WorkflowHistoryNavigationBarEventsMenu>
  );

  return {
    user,
    mockOnClickEvent,
  };
}
