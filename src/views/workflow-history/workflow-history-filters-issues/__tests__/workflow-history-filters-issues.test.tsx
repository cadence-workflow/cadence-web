import { render, screen, userEvent } from '@/test-utils/rtl';

import * as useConfigValueModule from '@/hooks/use-config-value/use-config-value';

import { type EventGroupIssuesFilterValue } from '../../workflow-history-filters-menu/workflow-history-filters-menu.types';
import WorkflowHistoryFiltersIssues from '../workflow-history-filters-issues';

jest.mock('@/hooks/use-config-value/use-config-value', () =>
  jest.fn(() => ({ data: false }))
);

describe(WorkflowHistoryFiltersIssues.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders nothing when diagnostics in history is disabled', () => {
    const { container } = setup({
      isDiagnosticsInHistoryEnabled: false,
    });

    expect(container.firstChild?.firstChild).toBeNull();
    expect(
      screen.queryByRole('switch', { name: 'Only show events with issues' })
    ).not.toBeInTheDocument();
  });

  it('renders switch when diagnostics in history is enabled', () => {
    setup({ isDiagnosticsInHistoryEnabled: true });

    expect(
      screen.getByRole('switch', { name: 'Only show events with issues' })
    ).toBeInTheDocument();
  });

  it('renders switch unchecked when historyEventIssues is undefined', () => {
    setup({
      isDiagnosticsInHistoryEnabled: true,
      value: { historyEventIssues: undefined },
    });

    expect(
      screen.getByRole('switch', { name: 'Only show events with issues' })
    ).not.toBeChecked();
  });

  it('renders switch checked when historyEventIssues is true', () => {
    setup({
      isDiagnosticsInHistoryEnabled: true,
      value: { historyEventIssues: true },
    });

    expect(
      screen.getByRole('switch', { name: 'Only show events with issues' })
    ).toBeChecked();
  });

  it('calls setValue with true when switch is checked', async () => {
    const { user, mockSetValue } = setup({
      isDiagnosticsInHistoryEnabled: true,
      value: { historyEventIssues: undefined },
    });

    await user.click(
      screen.getByRole('switch', { name: 'Only show events with issues' })
    );

    expect(mockSetValue).toHaveBeenCalledWith({ historyEventIssues: true });
  });

  it('calls setValue with undefined when switch is unchecked', async () => {
    const { user, mockSetValue } = setup({
      isDiagnosticsInHistoryEnabled: true,
      value: { historyEventIssues: true },
    });

    await user.click(
      screen.getByRole('switch', { name: 'Only show events with issues' })
    );

    expect(mockSetValue).toHaveBeenCalledWith({
      historyEventIssues: undefined,
    });
  });
});

function setup({
  isDiagnosticsInHistoryEnabled = false,
  value = { historyEventIssues: undefined },
}: {
  isDiagnosticsInHistoryEnabled?: boolean;
  value?: EventGroupIssuesFilterValue;
} = {}) {
  const user = userEvent.setup();
  const mockSetValue = jest.fn();

  jest.spyOn(useConfigValueModule, 'default').mockReturnValue({
    data: isDiagnosticsInHistoryEnabled,
  } as ReturnType<typeof useConfigValueModule.default>);

  const result = render(
    <WorkflowHistoryFiltersIssues value={value} setValue={mockSetValue} />
  );

  return {
    ...result,
    user,
    mockSetValue,
  };
}
