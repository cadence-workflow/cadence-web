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
  it('should render WorkflowHistoryV2 when isWorkflowHistoryV2Selected is true', () => {
    setup({ isWorkflowHistoryV2Selected: true });

    expect(screen.getByTestId('workflow-history-v2')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-history')).not.toBeInTheDocument();
  });

  it('should render WorkflowHistory when isWorkflowHistoryV2Selected is false', () => {
    setup({ isWorkflowHistoryV2Selected: false });

    expect(screen.getByTestId('workflow-history')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-history-v2')).not.toBeInTheDocument();
  });
});

function setup({
  isWorkflowHistoryV2Selected = false,
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
  isWorkflowHistoryV2Selected?: boolean;
  props?: Props;
} = {}) {
  render(
    <WorkflowHistoryContext.Provider
      value={{
        ungroupedViewUserPreference: null,
        setUngroupedViewUserPreference: jest.fn(),
        isWorkflowHistoryV2Selected,
        setIsWorkflowHistoryV2Selected: jest.fn(),
      }}
    >
      <WorkflowHistoryComponent {...props} />
    </WorkflowHistoryContext.Provider>
  );
}
