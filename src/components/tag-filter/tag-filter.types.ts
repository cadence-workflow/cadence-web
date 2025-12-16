import { type Theme } from 'baseui';

export type TagFilterOptionConfig = {
  label: string;
  startEnhancer?: React.ComponentType<{ theme: Theme }>;
};

export type Props<T extends string> = {
  label: string;
  values: Array<T>;
  onChangeValues: (newValues: Array<T>) => void;
  optionsConfig: Record<T, TagFilterOptionConfig>;
  hideShowAll?: boolean;
};
