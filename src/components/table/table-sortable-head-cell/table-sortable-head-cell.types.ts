export type Props = {
  name: string;
  columnID: string;
  width: string;
  sortColumn?: string;
  sortOrder?: string;
  onSort: (column: string) => void;
};
