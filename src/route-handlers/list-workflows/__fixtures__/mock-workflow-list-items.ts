import { type WorkflowListItem } from '../list-workflows.types';

export const mockWorkflowListItem: WorkflowListItem = {
  workflowID: 'mock-workflow-id',
  runID: 'mock-run-id',
  workflowName: 'mock-workflow-name',
  status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
  startTime: 1684800000000,
  executionTime: undefined,
  updateTime: undefined,
  closeTime: undefined,
  historyLength: 0,
  taskList: 'mock-task-list',
  isCron: false,
  clusterAttributeScope: undefined,
  clusterAttributeName: undefined,
};

export function getMockWorkflowListItem(
  overrides?: Partial<WorkflowListItem>
): WorkflowListItem {
  return {
    ...mockWorkflowListItem,
    ...overrides,
  };
}
