import { type WorkflowsListColumn } from '@/views/shared/workflows-list/workflows-list.types';

import { BATCH_ACTIONS_NEW_ACTION_VISIBLE_COLUMN_IDS } from '../../domain-batch-actions-new-action-detail.constants';
import getBatchActionsVisibleColumns from '../get-batch-actions-visible-columns';

const makeColumn = (id: string): WorkflowsListColumn => ({
  id,
  name: id,
  width: '1fr',
  isSystem: true,
  renderCell: () => null,
});

describe('getBatchActionsVisibleColumns', () => {
  it('returns the columns matching the configured IDs in the configured order', () => {
    const available = [
      'StartTime',
      'WorkflowID',
      'CloseStatus',
      'WorkflowType',
      'CloseTime',
      'RunID',
    ].map(makeColumn);

    const result = getBatchActionsVisibleColumns(available);

    expect(result.map((c) => c.id)).toEqual([
      ...BATCH_ACTIONS_NEW_ACTION_VISIBLE_COLUMN_IDS,
    ]);
  });

  it('skips IDs that are not in availableColumns', () => {
    const available = ['WorkflowID', 'CloseStatus'].map(makeColumn);

    const result = getBatchActionsVisibleColumns(available);

    expect(result.map((c) => c.id)).toEqual(['CloseStatus', 'WorkflowID']);
  });

  it('returns an empty array when availableColumns is empty', () => {
    expect(getBatchActionsVisibleColumns([])).toEqual([]);
  });
});
