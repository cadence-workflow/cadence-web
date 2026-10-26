import { mockWorkflowsListSystemColumns } from '@/views/shared/workflows-list/__fixtures__/mock-workflows-list-columns';
import { DEFAULT_WORKFLOWS_LIST_COLUMNS } from '@/views/shared/workflows-list/workflows-list.constants';

import getMarkdocWorkflowsListColumns from '../get-markdoc-workflows-list-columns';

describe(getMarkdocWorkflowsListColumns.name, () => {
  it('returns the default columns when no ids are given', () => {
    const ids = getMarkdocWorkflowsListColumns(
      mockWorkflowsListSystemColumns
    ).map((c) => c.id);
    expect(ids).toEqual(
      DEFAULT_WORKFLOWS_LIST_COLUMNS.filter((id) => id !== 'CloseTime')
    );
  });

  it('keeps the requested order and trims spaces', () => {
    const ids = getMarkdocWorkflowsListColumns(
      mockWorkflowsListSystemColumns,
      ' CloseStatus , WorkflowID '
    ).map((c) => c.id);
    expect(ids).toEqual(['CloseStatus', 'WorkflowID']);
  });

  it('ignores unknown ids', () => {
    const ids = getMarkdocWorkflowsListColumns(
      mockWorkflowsListSystemColumns,
      'Nope,WorkflowID'
    ).map((c) => c.id);
    expect(ids).toEqual(['WorkflowID']);
  });
});
