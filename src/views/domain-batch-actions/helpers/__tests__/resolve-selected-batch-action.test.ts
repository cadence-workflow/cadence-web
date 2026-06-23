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
        isDraftSelected: false,
      })
    ).toEqual({ selectedActionId: 'run-1', selectedWorkflowId: 'wf-1' });
  });

  it('selects the URL action and reads its workflowId from the list', () => {
    expect(
      resolveSelectedBatchAction({
        batchActions: ACTIONS,
        batchActionId: 'run-2',
        batchActionWorkflowId: undefined,
        isDraftSelected: false,
      })
    ).toEqual({ selectedActionId: 'run-2', selectedWorkflowId: 'wf-2' });
  });

  it('uses the workflowId from the URL for an action not in the list (deep link)', () => {
    expect(
      resolveSelectedBatchAction({
        batchActions: ACTIONS,
        batchActionId: 'run-999',
        batchActionWorkflowId: 'wf-999',
        isDraftSelected: false,
      })
    ).toEqual({ selectedActionId: 'run-999', selectedWorkflowId: 'wf-999' });
  });

  it('returns a null workflowId when the action is not in the list and the URL omits it', () => {
    expect(
      resolveSelectedBatchAction({
        batchActions: ACTIONS,
        batchActionId: 'run-999',
        batchActionWorkflowId: undefined,
        isDraftSelected: false,
      })
    ).toEqual({ selectedActionId: 'run-999', selectedWorkflowId: null });
  });

  it('tracks the first action while a draft is selected', () => {
    expect(
      resolveSelectedBatchAction({
        batchActions: ACTIONS,
        batchActionId: 'draft',
        batchActionWorkflowId: undefined,
        isDraftSelected: true,
      })
    ).toEqual({ selectedActionId: 'run-1', selectedWorkflowId: 'wf-1' });
  });

  it('returns nulls for an empty list', () => {
    expect(
      resolveSelectedBatchAction({
        batchActions: [],
        batchActionId: undefined,
        batchActionWorkflowId: undefined,
        isDraftSelected: false,
      })
    ).toEqual({ selectedActionId: null, selectedWorkflowId: null });
  });
});
