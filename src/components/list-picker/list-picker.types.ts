export type Props<T extends string> = {
  value: T | undefined;
  setValue: (value: T | undefined) => void;
  labelMap: Record<T, string>;
  label: string;
  placeholder: string;
};
