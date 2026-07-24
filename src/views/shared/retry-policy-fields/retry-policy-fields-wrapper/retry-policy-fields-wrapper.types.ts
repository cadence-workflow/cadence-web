import { type ComponentType, type ReactNode } from 'react';

export type FieldComponentProps = {
  label: string;
  description?: string;
  htmlFor?: string;
  error?: string;
  subfield?: boolean;
  children: ReactNode;
};

export type Props = FieldComponentProps & {
  fieldComponent?: ComponentType<FieldComponentProps>;
};
