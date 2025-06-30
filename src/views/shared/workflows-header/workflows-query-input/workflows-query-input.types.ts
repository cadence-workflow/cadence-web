export type Props = {
  value: string;
  setValue: (v: string | undefined) => void;
  refetchQuery: () => void;
  isQueryRunning: boolean;
};

export type AutocompleteSuggestionKind =
  | 'ATTRIBUTE'
  | 'OPERATOR'
  | 'VALUE'
  | 'TIME'
  | 'ID'
  | 'STATUS';
