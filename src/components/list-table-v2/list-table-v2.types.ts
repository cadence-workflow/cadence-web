export type ListTableV2SublistItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

interface ListTableV2Field {
  key: string;
  label: string;
  description?: string;
  kind: 'simple' | 'group';
}

export interface ListTableV2SimpleItem extends ListTableV2Field {
  kind: 'simple';
  value: React.ReactNode;
}

export interface ListTableV2Group extends ListTableV2Field {
  kind: 'group';
  items: Array<ListTableV2SublistItem>;
}

export type ListTableV2Item = ListTableV2SimpleItem | ListTableV2Group;

export type Props = {
  items: Array<ListTableV2Item>;
};
