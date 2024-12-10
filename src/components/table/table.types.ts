import type React from 'react';

import { type SortOrder } from '@/utils/sort-by';

import { type Props as InfiniteScrollLoaderProps } from './table-infinite-scroll-loader/table-infinite-scroll-loader.types';

export type TableColumn<T> = {
  name: string;
  id: string;
  renderCell: React.ComponentType<T> | ((row: T) => React.ReactNode);
  width: string;
  sortable?: boolean;
};

export type TableConfig<T> = Array<TableColumn<T>>;

type AreAnyColumnsSortable<T, C extends TableConfig<T>> = true extends {
  [K in keyof C]: C[K] extends { sortable: true } ? true : false;
}[number]
  ? true
  : false;

type EndMessageProps =
  | {
      kind: 'simple';
      content: React.ReactNode;
    }
  | ({
      kind: 'infinite-scroll';
    } & InfiniteScrollLoaderProps);

type OnSortFunctionOptional<T, C extends TableConfig<T>> =
  AreAnyColumnsSortable<T, C> extends true
    ? { onSort: (column: string) => void }
    : { onSort?: (column: string) => void };

export type Props<T, C extends TableConfig<T>> = {
  data: Array<T>;
  columns: C;
  shouldShowResults: boolean;
  endMessageProps: EndMessageProps;
  sortColumn?: string;
  sortOrder?: SortOrder;
} & OnSortFunctionOptional<T, C>;
