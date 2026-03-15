import { type WorkflowExecutionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionInfo';

import getWorkflowListItemFromExecution from '../get-workflow-list-item-from-execution';

const BASE_EXECUTION: WorkflowExecutionInfo = {
  workflowExecution: {
    workflowId: 'mock-wf-uuid-1',
    runId: 'mock-run-uuid-1',
  },
  type: { name: 'mock-workflow-name' },
  startTime: { seconds: '1717408148', nanos: 258000000 },
  closeTime: { seconds: '1717409148', nanos: 258000000 },
  closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
  historyLength: '100',
  parentExecutionInfo: null,
  executionTime: { seconds: '1717408150', nanos: 0 },
  memo: null,
  searchAttributes: null,
  autoResetPoints: null,
  taskList: 'mock-task-list',
  isCron: false,
  updateTime: { seconds: '1717408200', nanos: 0 },
  partitionConfig: {},
  taskListInfo: null,
  activeClusterSelectionPolicy: null,
  cronOverlapPolicy: 'CRON_OVERLAP_POLICY_INVALID',
};

describe('getWorkflowListItemFromExecution', () => {
  it('should map a complete execution to a WorkflowListItem', () => {
    expect(getWorkflowListItemFromExecution(BASE_EXECUTION)).toEqual({
      workflowID: 'mock-wf-uuid-1',
      runID: 'mock-run-uuid-1',
      workflowName: 'mock-workflow-name',
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      startTime: 1717408148258,
      executionTime: 1717408150000,
      updateTime: 1717408200000,
      closeTime: 1717409148258,
      historyLength: 100,
      taskList: 'mock-task-list',
      isCron: false,
      clusterAttributeScope: undefined,
      clusterAttributeName: undefined,
      searchAttributes: undefined,
      memo: undefined,
    });
  });

  it('should set optional time fields to undefined when null', () => {
    const execution: WorkflowExecutionInfo = {
      ...BASE_EXECUTION,
      closeTime: null,
      executionTime: null,
      updateTime: null,
    };

    const result = getWorkflowListItemFromExecution(execution);
    expect(result).toBeDefined();
    expect(result!.closeTime).toBeUndefined();
    expect(result!.executionTime).toBeUndefined();
    expect(result!.updateTime).toBeUndefined();
  });

  it('should return undefined when workflowExecution is null', () => {
    const execution: WorkflowExecutionInfo = {
      ...BASE_EXECUTION,
      workflowExecution: null,
    };

    expect(getWorkflowListItemFromExecution(execution)).toBeUndefined();
  });

  it('should return undefined when type is null', () => {
    const execution: WorkflowExecutionInfo = {
      ...BASE_EXECUTION,
      type: null,
    };

    expect(getWorkflowListItemFromExecution(execution)).toBeUndefined();
  });

  it('should return undefined when startTime is null', () => {
    const execution: WorkflowExecutionInfo = {
      ...BASE_EXECUTION,
      startTime: null,
    };

    expect(getWorkflowListItemFromExecution(execution)).toBeUndefined();
  });

  it('should map activeClusterSelectionPolicy fields', () => {
    const execution: WorkflowExecutionInfo = {
      ...BASE_EXECUTION,
      activeClusterSelectionPolicy: {
        strategy: 'ACTIVE_CLUSTER_SELECTION_STRATEGY_INVALID',
        strategyConfig: 'activeClusterStickyRegionConfig',
        clusterAttribute: {
          scope: 'mock-scope',
          name: 'mock-cluster-name',
        },
      },
    };

    const result = getWorkflowListItemFromExecution(execution);
    expect(result).toBeDefined();
    expect(result!.clusterAttributeScope).toBe('mock-scope');
    expect(result!.clusterAttributeName).toBe('mock-cluster-name');
  });

  it('should map searchAttributes when present', () => {
    const execution: WorkflowExecutionInfo = {
      ...BASE_EXECUTION,
      searchAttributes: {
        indexedFields: {
          CustomField: {
            data: Buffer.from('mock-value').toString('base64'),
          },
        },
      },
    };

    const result = getWorkflowListItemFromExecution(execution);
    expect(result).toBeDefined();
    expect(result!.searchAttributes).toEqual({
      indexedFields: { CustomField: 'mock-value' },
    });
  });

  it('should map memo when present', () => {
    const execution: WorkflowExecutionInfo = {
      ...BASE_EXECUTION,
      memo: {
        fields: {
          memoKey: {
            data: Buffer.from('mock-memo-value').toString('base64'),
          },
        },
      },
    };

    const result = getWorkflowListItemFromExecution(execution);
    expect(result).toBeDefined();
    expect(result!.memo).toEqual({
      fields: { memoKey: 'mock-memo-value' },
    });
  });

  it('should handle an open workflow (INVALID close status, no closeTime)', () => {
    const execution: WorkflowExecutionInfo = {
      ...BASE_EXECUTION,
      closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
      closeTime: null,
    };

    const result = getWorkflowListItemFromExecution(execution);
    expect(result).toBeDefined();
    expect(result!.status).toBe('WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID');
    expect(result!.closeTime).toBeUndefined();
  });

  it('should handle a cron workflow', () => {
    const execution: WorkflowExecutionInfo = {
      ...BASE_EXECUTION,
      isCron: true,
    };

    const result = getWorkflowListItemFromExecution(execution);
    expect(result).toBeDefined();
    expect(result!.isCron).toBe(true);
  });
});
