import { type FieldType } from '../../markdown-context-provider/markdown-context-provider.types';

export type InputFieldProps = {
  name: string;
  label?: string;
  type?: FieldType;
  default?: string | number;
  required?: boolean;
  placeholder?: string;
};
