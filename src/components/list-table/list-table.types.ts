export type ListTableItem<T extends object> = {
  key: string;
  label: string;
  renderValue: React.ComponentType<T> | ((props: T) => React.ReactNode);
};

export type Props<T extends object> = {
  data: T;
  listTableConfig: Array<ListTableItem<T>>;
};
