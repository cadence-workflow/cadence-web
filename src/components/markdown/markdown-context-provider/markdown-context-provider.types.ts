import { type ReactNode } from 'react';

export type FieldType = 'text' | 'number';

export type FieldMeta = {
  type: FieldType;
  required: boolean;
};

export type MarkdownContextType = {
  domain?: string;
  cluster?: string;
  workflowId?: string;
  runId?: string;
  onActionSuccess?: () => void;
  fieldValues?: Record<string, string>;
  fieldMeta?: Record<string, FieldMeta>;
  setFieldValue?: (name: string, value: string) => void;
  registerField?: (
    name: string,
    meta: FieldMeta,
    defaultValue?: string
  ) => void;
  unregisterField?: (name: string) => void;
};

export type Props = Pick<
  MarkdownContextType,
  'domain' | 'cluster' | 'workflowId' | 'runId' | 'onActionSuccess'
> & {
  children: ReactNode;
};
