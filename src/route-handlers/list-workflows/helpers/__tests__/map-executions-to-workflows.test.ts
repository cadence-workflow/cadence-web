import { type WorkflowExecutionInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionInfo';
import type { DomainWorkflow } from '@/views/domain-page/domain-page.types';

import mapExecutionsToWorkflows from '../map-executions-to-workflows';

const MOCK_WORKFLOW_EXECUTIONS: Array<WorkflowExecutionInfo> = [
  // Valid workflow executions
  {
    workflowExecution: {
      workflowId: 'mock-wf-uuid-1',
      runId: 'mock-run-uuid-1',
    },
    type: { name: 'mock-workflow-name' },
    startTime: { seconds: 1717408148, nanos: 258000000 },
    closeTime: { seconds: 1717409148, nanos: 258000000 },
    closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    historyLength: 100,
    parentExecutionInfo: null,
    executionTime: null,
    memo: null,
    searchAttributes: null,
    autoResetPoints: null,
    taskList: '',
    isCron: false,
    updateTime: null,
    partitionConfig: {},
  },
  {
    workflowExecution: {
      workflowId: 'mock-wf-uuid-2',
      runId: 'mock-run-uuid-2',
    },
    type: { name: 'mock-workflow-name' },
    startTime: { seconds: 1717408148, nanos: 258000000 },
    closeTime: null,
    closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
    historyLength: 100,
    parentExecutionInfo: null,
    executionTime: null,
    memo: null,
    searchAttributes: null,
    autoResetPoints: null,
    taskList: '',
    isCron: false,
    updateTime: null,
    partitionConfig: {},
  },
  // Invalid workflow executions
  {
    type: { name: 'mock-workflow-name' },
    startTime: { seconds: 1717408148, nanos: 258000000 },
    closeTime: { seconds: 1717409148, nanos: 258000000 },
    closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    workflowExecution: null,
    historyLength: 100,
    parentExecutionInfo: null,
    executionTime: null,
    memo: null,
    searchAttributes: null,
    autoResetPoints: null,
    taskList: '',
    isCron: false,
    updateTime: null,
    partitionConfig: {},
  },
  {
    workflowExecution: {
      workflowId: 'mock-wf-uuid-3',
      runId: 'mock-run-uuid-3',
    },
    startTime: { seconds: 1717408148, nanos: 258000000 },
    closeTime: { seconds: 1717409148, nanos: 258000000 },
    closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    type: null,
    historyLength: 100,
    parentExecutionInfo: null,
    executionTime: null,
    memo: null,
    searchAttributes: null,
    autoResetPoints: null,
    taskList: '',
    isCron: false,
    updateTime: null,
    partitionConfig: {},
  },
  {
    workflowExecution: {
      workflowId: 'mock-wf-uuid-4',
      runId: 'mock-run-uuid-4',
    },
    type: { name: 'mock-workflow-name' },
    closeTime: { seconds: 1717409148, nanos: 258000000 },
    closeStatus: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    startTime: null,
    historyLength: 100,
    parentExecutionInfo: null,
    executionTime: null,
    memo: null,
    searchAttributes: null,
    autoResetPoints: null,
    taskList: '',
    isCron: false,
    updateTime: null,
    partitionConfig: {},
  },
];

const MOCK_MAPPED_WORKFLOWS: Array<DomainWorkflow> = [
  {
    workflowID: 'mock-wf-uuid-1',
    runID: 'mock-run-uuid-1',
    workflowName: 'mock-workflow-name',
    status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
    startTime: 1717408148258,
    closeTime: 1717409148258,
  },
  {
    workflowID: 'mock-wf-uuid-2',
    runID: 'mock-run-uuid-2',
    workflowName: 'mock-workflow-name',
    status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
    startTime: 1717408148258,
    closeTime: undefined,
  },
];

describe('mapExecutionsToWorkflows', () => {
  it('should map workflow executions to workflows and filter out invalid executions', () => {
    expect(mapExecutionsToWorkflows(MOCK_WORKFLOW_EXECUTIONS)).toEqual(
      MOCK_MAPPED_WORKFLOWS
    );
  });
});
