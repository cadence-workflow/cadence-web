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

export type AttributeKey = 'CloseStatus' | 'Passed' | 'IsCron';
