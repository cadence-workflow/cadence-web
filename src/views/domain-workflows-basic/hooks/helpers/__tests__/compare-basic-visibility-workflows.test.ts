import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

import compareBasicVisibilityWorkflows from '../compare-basic-visibility-workflows';

function createMockWorkflow(
  startTime: number,
  closeTime?: number
): DomainWorkflow {
  return {
    workflowID: 'mock-id',
    runID: 'mock-run-id',
    workflowName: 'mock-name',
    status: closeTime
      ? 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED'
      : 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
    startTime,
    closeTime,
  };
}

describe('compareBasicVisibilityWorkflows', () => {
  it('should pick workflow with later start time for running workflows', () => {
    const firstWorkflow = createMockWorkflow(1741500000000);
    const secondWorkflow = createMockWorkflow(1741600000000);

    expect(compareBasicVisibilityWorkflows(firstWorkflow, secondWorkflow)).toBe(
      1
    );
    expect(compareBasicVisibilityWorkflows(secondWorkflow, firstWorkflow)).toBe(
      -1
    );
  });

  it('should pick workflow with later close time for closed workflows', () => {
    const firstWorkflow = createMockWorkflow(1741400000000, 1741600000000);
    const secondWorkflow = createMockWorkflow(1741500000000, 1741700000000);

    expect(compareBasicVisibilityWorkflows(firstWorkflow, secondWorkflow)).toBe(
      1
    );
    expect(compareBasicVisibilityWorkflows(secondWorkflow, firstWorkflow)).toBe(
      -1
    );
  });

  it('should pick running workflows over closed workflows', () => {
    const runningWorkflow = createMockWorkflow(1741500000000);
    const closedWorkflow = createMockWorkflow(1741500000000, 1741600000000);

    expect(
      compareBasicVisibilityWorkflows(runningWorkflow, closedWorkflow)
    ).toBe(-1);
    expect(
      compareBasicVisibilityWorkflows(closedWorkflow, runningWorkflow)
    ).toBe(1);
  });

  it('should handle edge cases with same timestamps', () => {
    const firstWorkflow = createMockWorkflow(1741500000000, 1741600000000);
    const secondWorkflow = createMockWorkflow(1741500000000, 1741600000000);

    expect(compareBasicVisibilityWorkflows(firstWorkflow, secondWorkflow)).toBe(
      -1
    );
  });
});
