import {
  BATCH_ACTION_DEFAULT_SELECT_HINT,
  BATCH_ACTION_SELECT_ALL_ROW_TOOLTIP,
} from '../domain-batch-actions.constants';
import { type BatchActionModeStrategy } from '../hooks/use-batch-action-target.types';

import buildSelectionQuery from './build-selection-query';
import getWorkflowSelectionId from './get-workflow-selection-id';

export default function getSelectModeStrategy({
  selectQuery,
  isDefaultFilters,
}: {
  selectQuery: string;
  isDefaultFilters: boolean;
}): BatchActionModeStrategy {
  return {
    query: selectQuery,
    resolve: ({ selection, selectedWorkflows, totalWorkflowCount }) => {
      const selectedCount = selection.isAllSelected
        ? totalWorkflowCount ?? 0
        : selectedWorkflows.length;
      const isTargetEmpty = selectedCount === 0;

      return {
        selectedCount,
        isTargetEmpty,
        blocksSubmit: isTargetEmpty,
        getBatchActionQuery: () =>
          selection.isAllSelected
            ? selectQuery
            : buildSelectionQuery(selectedWorkflows),
        queryHint: isDefaultFilters
          ? { kind: 'caption', message: BATCH_ACTION_DEFAULT_SELECT_HINT }
          : null,
        // The list renders checkboxes wired to the selection state.
        listSelection: {
          isAllSelected: selection.isAllSelected,
          onToggleAll: selection.toggleAll,
          isSelected: (workflow) =>
            selection.isSelected(getWorkflowSelectionId(workflow)),
          isRowToggleDisabled: selection.isAllSelected,
          rowToggleDisabledReason: BATCH_ACTION_SELECT_ALL_ROW_TOOLTIP,
          onToggle: (workflow) =>
            selection.toggleId(getWorkflowSelectionId(workflow)),
        },
      };
    },
  };
}
