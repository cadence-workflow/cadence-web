import type React from 'react';

import { type DomainWorkflow } from '@/views/domain-page/domain-page.types';

export type WorkflowsListColumnMatcher = {
  match: (attributeName: string, attributeType: string) => boolean;
  name?: string;
  width?: string;
  isDefault?: boolean;
  renderCell: (row: DomainWorkflow, attributeName: string) => React.ReactNode;
};

export type WorkflowsListColumn = {
  id: string;
  name: string;
  width: string;
  isDefault: boolean;
  renderCell: (row: DomainWorkflow) => React.ReactNode;
};

export type Props = {
  workflows: Array<DomainWorkflow>;
  columns: Array<WorkflowsListColumn>;
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
};
