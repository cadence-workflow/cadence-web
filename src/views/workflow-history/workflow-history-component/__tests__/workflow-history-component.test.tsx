import { render, screen } from '@/test-utils/rtl';

import { WorkflowHistoryContext } from '../../workflow-history-context-provider/workflow-history-context-provider';
import { type Props } from '../../workflow-history.types';
import WorkflowHistoryComponent from '../workflow-history-component';

jest.mock('@/views/workflow-history-v2/workflow-history-v2', () =>
  jest.fn(() => (
    <div data-testid="workflow-history-v2">Workflow History V2</div>
  ))
);

jest.mock('../../workflow-history', () =>
  jest.fn(() => <div data-testid="workflow-history">Workflow History V1</div>)
);

describe(WorkflowHistoryComponent.name, () => {
  it('should render WorkflowHistoryV2 when isWorkflowHistoryV2Enabled is true', () => {
    setup({ isWorkflowHistoryV2Enabled: true });

    expect(screen.getByTestId('workflow-history-v2')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-history')).not.toBeInTheDocument();
  });

  it('should render WorkflowHistory when isWorkflowHistoryV2Enabled is false', () => {
    setup({ isWorkflowHistoryV2Enabled: false });

    expect(screen.getByTestId('workflow-history')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-history-v2')).not.toBeInTheDocument();
  });
});

function setup({
  isWorkflowHistoryV2Enabled = false,
  props = {
    params: {
      cluster: 'test-cluster',
      domain: 'test-domain',
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
      workflowTab: 'history' as const,
    },
  },
}: {
  isWorkflowHistoryV2Enabled?: boolean;
  props?: Props;
} = {}) {
  render(
    <WorkflowHistoryContext.Provider
      value={{
        ungroupedViewUserPreference: null,
        setUngroupedViewUserPreference: jest.fn(),
        isWorkflowHistoryV2Enabled,
        setIsWorkflowHistoryV2Enabled: jest.fn(),
      }}
    >
      <WorkflowHistoryComponent {...props} />
    </WorkflowHistoryContext.Provider>
  );
}
