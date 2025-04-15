export type ListTableNestedSublistItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

interface ListTableNestedField {
  key: string;
  label: string;
  description?: string;
  kind: 'simple' | 'group';
}

export interface ListTableNestedSimpleItem extends ListTableNestedField {
  kind: 'simple';
  value: React.ReactNode;
}

export interface ListTableNestedGroup extends ListTableNestedField {
  kind: 'group';
  items: Array<ListTableNestedSublistItem>;
}

export type ListTableNestedItem =
  | ListTableNestedSimpleItem
  | ListTableNestedGroup;

export type Props = {
  items: Array<ListTableNestedItem>;
};
