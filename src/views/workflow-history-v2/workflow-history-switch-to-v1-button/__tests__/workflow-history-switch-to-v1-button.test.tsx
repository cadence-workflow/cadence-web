import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { WorkflowHistoryContext } from '@/views/workflow-history/workflow-history-context-provider/workflow-history-context-provider';

import WorkflowHistorySwitchToV1Button from '../workflow-history-switch-to-v1-button';

jest.mock(
  '../../workflow-history-view-toggle-button/workflow-history-view-toggle-button',
  () =>
    jest.fn(({ onClick, label }) => <button onClick={onClick}>{label}</button>)
);

describe(WorkflowHistorySwitchToV1Button.name, () => {
  it('should render button when config is OPT_IN', async () => {
    setup({ configValue: 'OPT_IN' });

    expect(
      await screen.findByText('Switch to the legacy History view')
    ).toBeInTheDocument();
  });

  it('should render button when config is OPT_OUT', async () => {
    setup({ configValue: 'OPT_OUT' });

    expect(
      await screen.findByText('Switch to the legacy History view')
    ).toBeInTheDocument();
  });

  it('should not render when config is DISABLED', async () => {
    setup({ configValue: 'DISABLED' });

    await waitFor(() => {
      expect(
        screen.queryByText('Switch to the legacy History view')
      ).not.toBeInTheDocument();
    });
  });

  it('should not render when config is ENABLED', async () => {
    setup({ configValue: 'ENABLED' });

    await waitFor(() => {
      expect(
        screen.queryByText('Switch to the legacy History view')
      ).not.toBeInTheDocument();
    });
  });

  it('should call setIsWorkflowHistoryV2Enabled with false when button is clicked', async () => {
    const { user, mockSetIsWorkflowHistoryV2Enabled } = setup({
      configValue: 'OPT_OUT',
    });

    const button = await screen.findByText('Switch to the legacy History view');
    await user.click(button);

    expect(mockSetIsWorkflowHistoryV2Enabled).toHaveBeenCalledTimes(1);
    expect(mockSetIsWorkflowHistoryV2Enabled).toHaveBeenCalledWith(false);
  });
});

function setup({ configValue }: { configValue: string }) {
  const user = userEvent.setup();
  const mockSetIsWorkflowHistoryV2Enabled = jest.fn();

  const contextValue = {
    ungroupedViewUserPreference: null,
    setUngroupedViewUserPreference: jest.fn(),
    isWorkflowHistoryV2Enabled: true,
    setIsWorkflowHistoryV2Enabled: mockSetIsWorkflowHistoryV2Enabled,
  };

  const renderResult = render(
    <WorkflowHistoryContext.Provider value={contextValue}>
      <WorkflowHistorySwitchToV1Button />
    </WorkflowHistoryContext.Provider>,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            return HttpResponse.json(configValue);
          },
        },
      ],
    }
  );

  return {
    user,
    mockSetIsWorkflowHistoryV2Enabled,
    ...renderResult,
  };
}
