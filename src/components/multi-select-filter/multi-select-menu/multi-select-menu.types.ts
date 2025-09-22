export type Props<T extends string> = {
  values: Array<T>;
  options: Array<MultiSelectMenuOption<T>>;
  onChangeValues: (newValues: Array<T>) => void;
  onCloseMenu: () => void;
};

export type MultiSelectMenuOption<T extends string> = {
  id: T;
  label: string;
};
