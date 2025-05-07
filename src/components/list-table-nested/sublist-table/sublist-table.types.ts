export type SublistItem = {
  key: string;
  label: string;
  value: React.ReactNode;
};

export type Props = {
  items: Array<SublistItem>;
};
