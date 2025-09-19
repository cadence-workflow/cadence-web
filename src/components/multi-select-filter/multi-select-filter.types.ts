export type Props<T extends string> = {
  label: string;
  placeholder: string;
  values: Array<T>;
  onChangeValues: (newValues: Array<T>) => void;
  optionsLabelMap: Record<T, string>;
};
