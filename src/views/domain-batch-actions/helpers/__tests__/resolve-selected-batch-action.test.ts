import { type BatchActionListItem } from '@/route-handlers/list-batch-actions/list-batch-actions.types';

import resolveSelectedBatchAction from '../resolve-selected-batch-action';

const ACTIONS: BatchActionListItem[] = [
  { workflowId: 'wf-1', runId: 'run-1', status: 'RUNNING' },
  { workflowId: 'wf-2', runId: 'run-2', status: 'COMPLETED' },
];

describe(resolveSelectedBatchAction.name, () => {
  it('defaults to the first action when nothing is selected', () => {
    expect(
      resolveSelectedBatchAction({
        batchActions: ACTIONS,
        batchActionId: undefined,
        batchActionWorkflowId: undefined,
      })
    ).toEqual({ selectedActionId: 'run-1', selectedWorkflowId: 'wf-1' });
  });

  it('selects the runId + workflowId pair from the URL (deep link)', () => {
    expect(
      resolveSelectedBatchAction({
        batchActions: ACTIONS,
        batchActionId: 'run-999',
        batchActionWorkflowId: 'wf-999',
      })
    ).toEqual({ selectedActionId: 'run-999', selectedWorkflowId: 'wf-999' });
  });

  it('resolves to nothing when the URL has a runId but no workflowId', () => {
    expect(
      resolveSelectedBatchAction({
        batchActions: ACTIONS,
        batchActionId: 'run-2',
        batchActionWorkflowId: undefined,
      })
    ).toEqual({ selectedActionId: null, selectedWorkflowId: null });
  });

  it('resolves to nothing when the URL has a workflowId but no runId', () => {
    expect(
      resolveSelectedBatchAction({
        batchActions: ACTIONS,
        batchActionId: undefined,
        batchActionWorkflowId: 'wf-999',
      })
    ).toEqual({ selectedActionId: null, selectedWorkflowId: null });
  });

  it('returns nulls for an empty list', () => {
    expect(
      resolveSelectedBatchAction({
        batchActions: [],
        batchActionId: undefined,
        batchActionWorkflowId: undefined,
      })
    ).toEqual({ selectedActionId: null, selectedWorkflowId: null });
  });
});
