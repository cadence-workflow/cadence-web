import { render, screen, userEvent } from '@/test-utils/rtl';

import { type EventGroupIssuesFilterValue } from '../../workflow-history-filters-menu/workflow-history-filters-menu.types';
import WorkflowHistoryFiltersIssues from '../workflow-history-filters-issues';

describe(WorkflowHistoryFiltersIssues.name, () => {
  it('renders switch', () => {
    setup();

    expect(
      screen.getByRole('switch', {
        name: 'Only show events with issues',
      })
    ).toBeInTheDocument();
  });

  it('renders switch unchecked when historyEventIssues is false', () => {
    setup({
      value: { historyEventIssues: false },
    });

    expect(
      screen.getByRole('switch', {
        name: 'Only show events with issues',
      })
    ).not.toBeChecked();
  });

  it('renders switch checked when historyEventIssues is true', () => {
    setup({
      value: { historyEventIssues: true },
    });

    expect(
      screen.getByRole('switch', {
        name: 'Only show events with issues',
      })
    ).toBeChecked();
  });

  it('calls setValue with true when switch is checked', async () => {
    const { user, mockSetValue } = setup({
      value: { historyEventIssues: false },
    });

    await user.click(
      screen.getByRole('switch', {
        name: 'Only show events with issues',
      })
    );

    expect(mockSetValue).toHaveBeenCalledWith({ historyEventIssues: true });
  });

  it('calls setValue with false when switch is unchecked', async () => {
    const { user, mockSetValue } = setup({
      value: { historyEventIssues: true },
    });

    await user.click(
      screen.getByRole('switch', {
        name: 'Only show events with issues',
      })
    );

    expect(mockSetValue).toHaveBeenCalledWith({
      historyEventIssues: false,
    });
  });
});

function setup({
  value = { historyEventIssues: false },
}: {
  value?: EventGroupIssuesFilterValue;
} = {}) {
  const user = userEvent.setup();
  const mockSetValue = jest.fn();

  const result = render(
    <WorkflowHistoryFiltersIssues value={value} setValue={mockSetValue} />
  );

  return {
    ...result,
    user,
    mockSetValue,
  };
}
