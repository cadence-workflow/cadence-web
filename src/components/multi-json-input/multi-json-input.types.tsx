export type Props = {
  label?: string;
  placeholder?: string;
  value?: string[];
  onChange: (value: string[]) => void;
  error?: string | string[];
  addButtonText?: string;
};
