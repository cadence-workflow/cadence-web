import type React from 'react';

import { type IndexedValueType } from '@/__generated__/proto-ts/uber/cadence/api/v1/IndexedValueType';
import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

export type WorkflowsListColumnConfig = {
  match: (attributeName: string, attributeType: IndexedValueType) => boolean;
  name?: string;
  width?: string;
  renderCell: (row: DomainWorkflow, attributeName: string) => React.ReactNode;
};

export type WorkflowsListColumn = {
  id: string;
  name: string;
  width: string;
  isSystem: boolean;
  renderCell: (row: DomainWorkflow) => React.ReactNode;
};

export type Props = {
  workflows: Array<DomainWorkflow>;
  columns: Array<WorkflowsListColumn>;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
};
