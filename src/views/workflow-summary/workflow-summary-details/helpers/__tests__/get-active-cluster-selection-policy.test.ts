import { type ActiveClusterSelectionPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ActiveClusterSelectionPolicy';
import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';
import { mockFormattedFirstEvent } from '@/views/workflow-summary/__fixtures__/formatted-first-history-event';

import getActiveClusterSelectionPolicy from '../get-active-cluster-selection-policy';

const mockRegionStickyPolicy: ActiveClusterSelectionPolicy = {
  strategyConfig: 'activeClusterStickyRegionConfig',
  strategy: 'ACTIVE_CLUSTER_SELECTION_STRATEGY_REGION_STICKY',
  activeClusterStickyRegionConfig: {
    stickyRegion: 'us-west-1',
  },
};

const mockExternalEntityPolicy: ActiveClusterSelectionPolicy = {
  strategyConfig: 'activeClusterExternalEntityConfig',
  strategy: 'ACTIVE_CLUSTER_SELECTION_STRATEGY_EXTERNAL_ENTITY',
  activeClusterExternalEntityConfig: {
    externalEntityType: 'customer',
    externalEntityKey: 'customer-123',
  },
};

describe(getActiveClusterSelectionPolicy.name, () => {
  it('returns policy from workflowDetails when available', () => {
    const result = getActiveClusterSelectionPolicy({
      workflowDetails: {
        ...mockDescribeWorkflowResponse,
        workflowExecutionInfo: {
          ...mockDescribeWorkflowResponse.workflowExecutionInfo,
          activeClusterSelectionPolicy: mockRegionStickyPolicy,
        },
      },
      formattedFirstEvent: mockFormattedFirstEvent,
    });

    expect(result).toEqual(mockRegionStickyPolicy);
  });

  it('returns policy from formattedFirstEvent when workflowDetails has no policy', () => {
    const formattedFirstEvent = Object.assign({}, mockFormattedFirstEvent);
    formattedFirstEvent.activeClusterSelectionPolicy = mockExternalEntityPolicy;

    const result = getActiveClusterSelectionPolicy({
      workflowDetails: mockDescribeWorkflowResponse,
      formattedFirstEvent,
    });

    expect(result).toEqual(mockExternalEntityPolicy);
  });

  it('returns null when no policy is available in either source', () => {
    const result = getActiveClusterSelectionPolicy({
      workflowDetails: mockDescribeWorkflowResponse,
      formattedFirstEvent: mockFormattedFirstEvent,
    });

    expect(result).toBeNull();
  });
});
