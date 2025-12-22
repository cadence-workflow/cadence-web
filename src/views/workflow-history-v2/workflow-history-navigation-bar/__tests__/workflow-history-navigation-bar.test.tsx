import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHistoryNavigationBar from '../workflow-history-navigation-bar';
import { type Props } from '../workflow-history-navigation-bar.types';

describe(WorkflowHistoryNavigationBar.name, () => {
  it('renders all navigation buttons', () => {
    setup();

    expect(screen.getByLabelText('Expand all')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll down')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll up')).toBeInTheDocument();
  });

  it('shows expand label when items are not expanded', () => {
    setup({ areAllItemsExpanded: false });

    const expandButton = screen.getByLabelText('Expand all');
    expect(expandButton).toBeInTheDocument();
  });

  it('shows collapse label when items are expanded', () => {
    setup({ areAllItemsExpanded: true });

    const collapseButton = screen.getByLabelText('Collapse all');
    expect(collapseButton).toBeInTheDocument();
  });

  it('calls onToggleAllItemsExpanded when expand/collapse button is clicked', async () => {
    const { user, mockOnToggleAllItemsExpanded } = setup({
      areAllItemsExpanded: false,
    });

    const expandButton = screen.getByLabelText('Expand all');
    await user.click(expandButton);

    expect(mockOnToggleAllItemsExpanded).toHaveBeenCalledTimes(1);
  });

  it('calls onScrollDown when scroll down button is clicked', async () => {
    const { user, mockOnScrollDown } = setup();

    const scrollDownButton = screen.getByLabelText('Scroll down');
    await user.click(scrollDownButton);

    expect(mockOnScrollDown).toHaveBeenCalledTimes(1);
  });

  it('calls onScrollUp when scroll up button is clicked', async () => {
    const { user, mockOnScrollUp } = setup();

    const scrollUpButton = screen.getByLabelText('Scroll up');
    await user.click(scrollUpButton);

    expect(mockOnScrollUp).toHaveBeenCalledTimes(1);
  });
});

function setup(overrides: Partial<Props> = {}) {
  const user = userEvent.setup();
  const mockOnScrollUp = jest.fn();
  const mockOnScrollDown = jest.fn();
  const mockOnToggleAllItemsExpanded = jest.fn();

  render(
    <WorkflowHistoryNavigationBar
      onScrollUp={mockOnScrollUp}
      onScrollDown={mockOnScrollDown}
      areAllItemsExpanded={false}
      onToggleAllItemsExpanded={mockOnToggleAllItemsExpanded}
      {...overrides}
    />
  );

  return {
    user,
    mockOnScrollUp,
    mockOnScrollDown,
    mockOnToggleAllItemsExpanded,
  };
}
