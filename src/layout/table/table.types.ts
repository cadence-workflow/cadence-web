export type TableColumn<T> = {
  name: string;
  id: string;
  renderCell: React.ComponentType<T> | ((row: T) => React.ReactNode);
  sortable?: boolean;
};

export type Props<T> = {
  data: Array<T>;
  columns: Array<TableColumn<T>>;
  shouldShowResults: boolean;
  endMessage: React.ReactNode;
  // Sort params
  onSort: (column: string) => void;
  sortColumn: string;
  sortOrder: SortingOrder;
};

export type SortingOrder = 'ASC' | 'DESC';
