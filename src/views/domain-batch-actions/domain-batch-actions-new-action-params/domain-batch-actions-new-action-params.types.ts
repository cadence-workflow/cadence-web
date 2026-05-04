export type Props = {
  description: string;
  rps: number;
  onDescriptionChange: (value: string) => void;
  onRpsChange: (value: number) => void;
  descriptionError?: string;
  rpsError?: string;
};
