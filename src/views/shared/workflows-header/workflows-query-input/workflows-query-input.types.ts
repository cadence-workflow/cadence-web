import type { OTHER_ATTRIBUTES } from './workflows-query-input.constants';

export type Props = {
  value: string;
  setValue: (v: string | undefined) => void;
  refetchQuery: () => void;
  isQueryRunning: boolean;
};

export type Suggestion = {
  name: string;
  type: string;
};

export type OtherAttributeKey = (typeof OTHER_ATTRIBUTES)[number];
