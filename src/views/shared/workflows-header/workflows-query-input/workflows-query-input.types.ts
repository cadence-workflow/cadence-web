export type Props = {
  value: string;
  setValue: (v: string | undefined) => void;
  refetchQuery: () => void;
  isQueryRunning: boolean;
};
