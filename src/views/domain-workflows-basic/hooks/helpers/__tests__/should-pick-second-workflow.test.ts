import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

import shouldPickSecondWorkflow from '../should-pick-second-workflow';

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

describe('shouldPickSecondWorkflow', () => {
  it('should pick workflow with later start time for running workflows', () => {
    const firstWorkflow = createMockWorkflow(1741500000000);
    const secondWorkflow = createMockWorkflow(1741600000000);

    expect(shouldPickSecondWorkflow(firstWorkflow, secondWorkflow)).toBe(true);
    expect(shouldPickSecondWorkflow(secondWorkflow, firstWorkflow)).toBe(false);
  });

  it('should pick workflow with later close time for closed workflows', () => {
    const firstWorkflow = createMockWorkflow(1741400000000, 1741600000000);
    const secondWorkflow = createMockWorkflow(1741500000000, 1741700000000);

    expect(shouldPickSecondWorkflow(firstWorkflow, secondWorkflow)).toBe(true);
    expect(shouldPickSecondWorkflow(secondWorkflow, firstWorkflow)).toBe(false);
  });

  it('should pick running workflows over closed workflows', () => {
    const runningWorkflow = createMockWorkflow(1741500000000);
    const closedWorkflow = createMockWorkflow(1741500000000, 1741600000000);

    expect(shouldPickSecondWorkflow(runningWorkflow, closedWorkflow)).toBe(
      false
    );
    expect(shouldPickSecondWorkflow(closedWorkflow, runningWorkflow)).toBe(
      true
    );
  });

  it('should handle edge cases with same timestamps', () => {
    const firstWorkflow = createMockWorkflow(1741500000000, 1741600000000);
    const secondWorkflow = createMockWorkflow(1741500000000, 1741600000000);

    expect(shouldPickSecondWorkflow(firstWorkflow, secondWorkflow)).toBe(false);
  });
});
