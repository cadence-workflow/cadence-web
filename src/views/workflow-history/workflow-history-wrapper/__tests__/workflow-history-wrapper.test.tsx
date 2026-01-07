import { render, screen } from '@/test-utils/rtl';

import { type Props } from '../../workflow-history.types';
import WorkflowHistoryWrapper from '../workflow-history-wrapper';

const mockUseSuspenseIsWorkflowHistoryV2Enabled = jest.fn();

jest.mock(
  '@/views/workflow-history-v2/hooks/use-suspense-is-workflow-history-v2-enabled',
  () => jest.fn(() => mockUseSuspenseIsWorkflowHistoryV2Enabled())
);

jest.mock('../../../workflow-history-v2/workflow-history-v2', () =>
  jest.fn(() => (
    <div data-testid="workflow-history-v2">Workflow History V2</div>
  ))
);

jest.mock('../../workflow-history', () =>
  jest.fn(() => <div data-testid="workflow-history">Workflow History V1</div>)
);

describe(WorkflowHistoryWrapper.name, () => {
  it('should render WorkflowHistoryV2 when useSuspenseIsWorkflowHistoryV2Enabled returns true', () => {
    mockUseSuspenseIsWorkflowHistoryV2Enabled.mockReturnValue(true);
    setup();

    expect(screen.getByTestId('workflow-history-v2')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-history')).not.toBeInTheDocument();
  });

  it('should render WorkflowHistory when useSuspenseIsWorkflowHistoryV2Enabled returns false', () => {
    mockUseSuspenseIsWorkflowHistoryV2Enabled.mockReturnValue(false);
    setup();

    expect(screen.getByTestId('workflow-history')).toBeInTheDocument();
    expect(screen.queryByTestId('workflow-history-v2')).not.toBeInTheDocument();
  });
});

function setup({
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
  props?: Props;
} = {}) {
  render(<WorkflowHistoryWrapper {...props} />);
}
