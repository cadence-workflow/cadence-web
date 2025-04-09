type ListTableV2SublistItem = {
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

interface ListTableV2Item extends ListTableV2Field {
  kind: 'simple';
  value: React.ReactNode;
}

interface ListTableV2Group extends ListTableV2Field {
  kind: 'group';
  items: Array<ListTableV2SublistItem>;
}

// export type ListTableV2Item = {
//   key: string;
//   label: string;
//   kind: K;
//   description?: string;
//   value: K extends 'group' ? Array<ListTableV2SublistItem> : React.ReactNode;
// };

export type Props = {
  items: Array<ListTableV2Item | ListTableV2Group>;
};
