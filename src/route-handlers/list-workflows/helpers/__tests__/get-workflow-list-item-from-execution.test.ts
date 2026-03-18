import { type WorkflowExecutionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionInfo';

import { mockWorkflowExecutions } from '../../__fixtures__/mock-workflow-executions';
import getWorkflowListItemFromExecution from '../get-workflow-list-item-from-execution';

const BASE_EXECUTION = mockWorkflowExecutions[0];

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

  it('should return raw searchAttributes when present', () => {
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
      CustomField: {
        data: Buffer.from('mock-value').toString('base64'),
      },
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
