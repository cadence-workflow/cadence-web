export type Props<T extends string> = {
  values: Array<T> | undefined;
  onChangeValues: (values: Array<T> | undefined) => void;
  labelMap: Record<T, string>;
  label: string;
  placeholder: string;
};
