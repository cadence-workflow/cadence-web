export type ColumnDefinition = {
  id: string;
  name: string;
  isSystem: boolean;
};

export type ColumnState = { id: string; checked: boolean };

export type Props = {
  allColumns: Array<ColumnDefinition>;
  selectedColumnIds: Array<string>;
  onApply: (selectedColumnIds: Array<string>) => void;
  onReset: () => void;
};
