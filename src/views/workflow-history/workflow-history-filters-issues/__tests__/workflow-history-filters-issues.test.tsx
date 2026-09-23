import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';

import { type EventGroupIssuesFilterValue } from '../../workflow-history-filters-menu/workflow-history-filters-menu.types';
import WorkflowHistoryFiltersIssues from '../workflow-history-filters-issues';

describe(WorkflowHistoryFiltersIssues.name, () => {
  it('renders nothing when diagnostics in history is disabled', async () => {
    const { container } = setup({
      isDiagnosticsInHistoryEnabled: false,
    });

    await waitFor(() => {
      expect(container.firstChild?.firstChild).toBeNull();
    });
    expect(
      screen.queryByRole('switch', { name: 'Only show events with issues' })
    ).not.toBeInTheDocument();
  });

  it('renders switch when diagnostics in history is enabled', async () => {
    setup({ isDiagnosticsInHistoryEnabled: true });

    expect(
      await screen.findByRole('switch', {
        name: 'Only show events with issues',
      })
    ).toBeInTheDocument();
  });

  it('renders switch unchecked when historyEventIssues is undefined', async () => {
    setup({
      isDiagnosticsInHistoryEnabled: true,
      value: { historyEventIssues: undefined },
    });

    expect(
      await screen.findByRole('switch', {
        name: 'Only show events with issues',
      })
    ).not.toBeChecked();
  });

  it('renders switch checked when historyEventIssues is true', async () => {
    setup({
      isDiagnosticsInHistoryEnabled: true,
      value: { historyEventIssues: true },
    });

    expect(
      await screen.findByRole('switch', {
        name: 'Only show events with issues',
      })
    ).toBeChecked();
  });

  it('calls setValue with true when switch is checked', async () => {
    const { user, mockSetValue } = setup({
      isDiagnosticsInHistoryEnabled: true,
      value: { historyEventIssues: undefined },
    });

    await user.click(
      await screen.findByRole('switch', {
        name: 'Only show events with issues',
      })
    );

    expect(mockSetValue).toHaveBeenCalledWith({ historyEventIssues: true });
  });

  it('calls setValue with undefined when switch is unchecked', async () => {
    const { user, mockSetValue } = setup({
      isDiagnosticsInHistoryEnabled: true,
      value: { historyEventIssues: true },
    });

    await user.click(
      await screen.findByRole('switch', {
        name: 'Only show events with issues',
      })
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

  const result = render(
    <WorkflowHistoryFiltersIssues value={value} setValue={mockSetValue} />,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () =>
            HttpResponse.json(
              isDiagnosticsInHistoryEnabled satisfies GetConfigResponse<'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'>
            ),
        },
      ],
    }
  );

  return {
    ...result,
    user,
    mockSetValue,
  };
}
