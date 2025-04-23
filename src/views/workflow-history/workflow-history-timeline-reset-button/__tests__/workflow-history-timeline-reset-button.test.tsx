import { HttpResponse } from 'msw';

import { render, screen, fireEvent } from '@/test-utils/rtl';

import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';
import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import mockResolvedConfigValues from '@/utils/config/__fixtures__/resolved-config-values';
import { mockResetActionConfig } from '@/views/workflow-actions/__fixtures__/workflow-actions-config';
import { resetWorkflowActionConfig } from '@/views/workflow-actions/config/workflow-actions.config';
import { describeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import WorkflowHistoryTimelineResetButton from '../workflow-history-timeline-reset-button';
import type Props from '../workflow-history-timeline-reset-button.types';
jest.mock('@/views/workflow-actions/config/workflow-actions.config', () => {
  const originalModule = jest.requireActual(
    '@/views/workflow-actions/config/workflow-actions.config'
  );
  return {
    ...originalModule,
    resetWorkflowActionConfig: {
      ...mockResetActionConfig,
      getRunnableStatus: jest.fn(),
    },
  };
});

describe('WorkflowHistoryTimelineResetButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders reset button when all conditions are met', async () => {
    setup({});

    // Wait for any async operations to complete
    await screen.findByText('Reset');

    const resetButton = screen.getByText('Reset');
    expect(resetButton).toBeInTheDocument();
  });

  it('calls onReset when button is clicked', async () => {
    const { mockOnReset } = setup({});

    // Wait for any async operations to complete
    const resetButton = await screen.findByText('Reset');
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('does not render when reset action is not enabled', () => {
    setup({
      resetActionsEnabledConfig: 'DISABLED',
    });

    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('does not render when reset is not runnable', () => {
    setup({
      isResetRunnable: false,
    });

    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('does not render when workflow is loading', () => {
    setup({
      isWorkflowLoading: true,
    });

    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('does not render when actions config is loading', () => {
    setup({
      isActionsEnabledLoading: true,
    });

    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('does not render when workflow has error', () => {
    setup({
      isWorkflowError: true,
    });

    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('does not render when actions config has error', () => {
    setup({
      isActionsEnabledError: true,
    });

    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });
});

function setup({
  workflowId = 'test-workflow-id',
  runId = 'test-run-id',
  domain = 'test-domain',
  cluster = 'test-cluster',
  workflowCloseStatus = 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
  isWorkflowLoading = false,
  isWorkflowError = false,
  resetActionsEnabledConfig = 'ENABLED',
  isActionsEnabledLoading = false,
  isActionsEnabledError = false,
  isResetRunnable = true,
}: Partial<Omit<Props, 'onReset'>> & {
  workflowCloseStatus?: WorkflowExecutionCloseStatus;
  isWorkflowLoading?: boolean;
  isWorkflowError?: boolean;
  resetActionsEnabledConfig?: string;
  isActionsEnabledLoading?: boolean;
  isActionsEnabledError?: boolean;
  isResetRunnable?: boolean;
}) {
  const mockOnReset = jest.fn();
  (resetWorkflowActionConfig.getRunnableStatus as jest.Mock).mockReturnValue(
    isResetRunnable ? 'RUNNABLE' : 'NOT_RUNNABLE'
  );

  render(
    <WorkflowHistoryTimelineResetButton
      workflowId={workflowId}
      runId={runId}
      domain={domain}
      cluster={cluster}
      onReset={mockOnReset}
    />,
    {
      endpointsMocks: [
        {
          path: `/api/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (isWorkflowError) {
              return HttpResponse.json(
                { error: 'Workflow error' },
                { status: 500 }
              );
            }
            if (isWorkflowLoading) {
              return new Promise(() => {});
            }

            const response: DescribeWorkflowResponse = {
              ...describeWorkflowResponse,
              workflowExecutionInfo: {
                ...describeWorkflowResponse.workflowExecutionInfo,
                closeStatus: workflowCloseStatus,
              },
            };

            return HttpResponse.json(response);
          },
        },
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (isActionsEnabledError) {
              return HttpResponse.json(
                { error: 'Config error' },
                { status: 500 }
              );
            }
            if (isActionsEnabledLoading) {
              return new Promise(() => {});
            }

            const actionsEnabledConfig =
              mockResolvedConfigValues['WORKFLOW_ACTIONS_ENABLED'];
            return HttpResponse.json({
              ...actionsEnabledConfig,
              reset: resetActionsEnabledConfig,
            });
          },
        },
      ],
    }
  );
  return { mockOnReset };
}
