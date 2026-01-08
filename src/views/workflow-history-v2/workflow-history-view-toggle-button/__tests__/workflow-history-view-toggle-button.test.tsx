import React from 'react';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import WorkflowHistoryViewToggleButton from '../workflow-history-view-toggle-button';
import { type Props } from '../workflow-history-view-toggle-button.types';

describe(WorkflowHistoryViewToggleButton.name, () => {
  it('should render button with label', () => {
    setup();

    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', async () => {
    const { user, mockOnClick } = setup();

    const button = screen.getByText('Test Button');
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should render tooltip content when popover is opened on hover', async () => {
    const { user } = setup();

    const button = screen.getByText('Test Button');
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    });
  });

  it('should render link buttons when provided', async () => {
    const { user } = setup({
      tooltipContent: {
        content: ['Test content'],
        linkButtons: [
          {
            label: 'Learn More',
            href: '/docs',
            startEnhancer: null,
          },
          {
            label: 'FAQ',
            href: '/faq',
            startEnhancer: null,
          },
        ],
      },
    });

    const button = screen.getByText('Test Button');
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByText('Learn More')).toBeInTheDocument();
      expect(screen.getByText('FAQ')).toBeInTheDocument();
    });
  });

  it('should not render link buttons when not provided', async () => {
    const { user } = setup({
      tooltipContent: {
        content: ['Test content'],
      },
    });

    const button = screen.getByText('Test Button');
    await user.hover(button);

    await waitFor(() => {
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    expect(screen.queryByText('Learn More')).not.toBeInTheDocument();
  });

  it('should render with primary kind', () => {
    setup({ kind: 'primary' });

    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('should render with secondary kind', () => {
    setup({ kind: 'secondary' });

    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });
});

function setup(props: Partial<Props> = {}) {
  const user = userEvent.setup();
  const mockOnClick = jest.fn();

  const defaultProps: Props = {
    kind: 'primary',
    label: 'Test Button',
    onClick: mockOnClick,
    tooltipContent: {
      content: ['First paragraph', 'Second paragraph'],
    },
    ...props,
  };

  const renderResult = render(
    <WorkflowHistoryViewToggleButton {...defaultProps} />
  );

  return {
    user,
    mockOnClick,
    ...renderResult,
  };
}
