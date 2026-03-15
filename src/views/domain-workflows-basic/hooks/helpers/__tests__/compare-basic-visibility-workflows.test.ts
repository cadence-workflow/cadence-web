import { getMockWorkflowListItem } from '@/views/shared/workflows-table/__fixtures__/mock-workflows-list';

import compareBasicVisibilityWorkflows from '../compare-basic-visibility-workflows';

describe('compareBasicVisibilityWorkflows', () => {
  it('should pick workflow with later start time for running workflows', () => {
    const firstWorkflow = getMockWorkflowListItem({ startTime: 1741500000000 });
    const secondWorkflow = getMockWorkflowListItem({
      startTime: 1741600000000,
    });

    expect(compareBasicVisibilityWorkflows(firstWorkflow, secondWorkflow)).toBe(
      1
    );
    expect(compareBasicVisibilityWorkflows(secondWorkflow, firstWorkflow)).toBe(
      -1
    );
  });

  it('should pick workflow with later close time for closed workflows', () => {
    const firstWorkflow = getMockWorkflowListItem({
      startTime: 1741400000000,
      closeTime: 1741600000000,
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    });
    const secondWorkflow = getMockWorkflowListItem({
      startTime: 1741500000000,
      closeTime: 1741700000000,
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    });

    expect(compareBasicVisibilityWorkflows(firstWorkflow, secondWorkflow)).toBe(
      1
    );
    expect(compareBasicVisibilityWorkflows(secondWorkflow, firstWorkflow)).toBe(
      -1
    );
  });

  it('should pick running workflows over closed workflows', () => {
    const runningWorkflow = getMockWorkflowListItem({
      startTime: 1741500000000,
    });
    const closedWorkflow = getMockWorkflowListItem({
      startTime: 1741500000000,
      closeTime: 1741600000000,
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    });

    expect(
      compareBasicVisibilityWorkflows(runningWorkflow, closedWorkflow)
    ).toBe(-1);
    expect(
      compareBasicVisibilityWorkflows(closedWorkflow, runningWorkflow)
    ).toBe(1);
  });

  it('should handle edge cases with same timestamps', () => {
    const firstWorkflow = getMockWorkflowListItem({
      startTime: 1741500000000,
      closeTime: 1741600000000,
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    });
    const secondWorkflow = getMockWorkflowListItem({
      startTime: 1741500000000,
      closeTime: 1741600000000,
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    });

    expect(compareBasicVisibilityWorkflows(firstWorkflow, secondWorkflow)).toBe(
      -1
    );
  });
});
