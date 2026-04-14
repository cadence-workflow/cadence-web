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

type SortParams = {
  onSort: (column: string) => void;
  sortColumn: string;
  sortOrder: SortOrder;
};

export type Props = {
  workflows: Array<DomainWorkflow>;
  columns: Array<WorkflowsListColumn>;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  sortParams?: SortParams;
};
