import type React from 'react';

import { type TableVirtuosoProps } from 'react-virtuoso';

import { type SortOrder } from '@/utils/sort-by';

import {
  type EndMessageProps,
  type OnSortFunctionOptional,
} from '../table/table.types';

export type TableColumn<T> = {
  name: string;
  id: string;
  renderCell: React.ComponentType<T> | ((row: T) => React.ReactNode);
  width: string;
  sortable?: boolean;
};

export type TableConfig<T> = Array<TableColumn<T>>;

export type Props<T, C extends TableConfig<T>> = {
  data: Array<T>;
  columns: C;
  shouldShowResults: boolean;
  endMessageProps: EndMessageProps;
  sortColumn?: string;
  sortOrder?: SortOrder;
} & Omit<
  TableVirtuosoProps<T, any>,
  'data' | 'itemContent' | 'fixedHeaderContent' | 'fixedFooterContent'
> &
  OnSortFunctionOptional<T, C>;
