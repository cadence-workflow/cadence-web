import type React from 'react';

import { type IndexedValueType } from '@/__generated__/proto-ts/uber/cadence/api/v1/IndexedValueType';
import { type SortOrder } from '@/utils/sort-by';
import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

export type WorkflowsListColumnConfig = {
  match: (attributeName: string, attributeType: IndexedValueType) => boolean;
  name?: string;
  width?: string;
  sortable?: boolean;
  renderCell: (row: DomainWorkflow, attributeName: string) => React.ReactNode;
};

export type WorkflowsListColumn = {
  id: string;
  name: string;
  width: string;
  isSystem: boolean;
  sortable?: boolean;
  renderCell: (row: DomainWorkflow) => React.ReactNode;
};

export type SortParams = {
  onSort: (column: string) => void;
  sortColumn: string;
  sortOrder: SortOrder;
};

// Opt-in row selection. When provided, the list renders a leading checkbox
// column (a "select all" checkbox in the header and one per row). The list is
// stateless about selection: a parent owns the state (e.g. via useListSelection)
// and passes the derived predicates/handlers here.
export type SelectionParams = {
  isAllSelected: boolean;
  onToggleAll: () => void;
  isSelected: (workflow: DomainWorkflow) => boolean;
  // When true, per-row checkboxes are rendered checked but disabled (used while
  // "select all" is active).
  isRowToggleDisabled: boolean;
  // Optional short message shown in a tooltip when hovering a disabled per-row
  // checkbox, explaining why it cannot be toggled.
  rowToggleDisabledReason?: string;
  onToggle: (workflow: DomainWorkflow) => void;
};

export type Props = {
  workflows: Array<DomainWorkflow>;
  columns: Array<WorkflowsListColumn>;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  sortParams?: SortParams;
  selection?: SelectionParams;
};
