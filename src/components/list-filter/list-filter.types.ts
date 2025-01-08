export type Props<T extends string> = {
  value: T | undefined;
  onChangeValue: (value: T | undefined) => void;
  labelMap: Record<T, string>;
  label: string;
  placeholder: string;
};
