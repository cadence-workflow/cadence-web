import { type ReactNode } from 'react';

import {
  type DefaultValues,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';
import { type z } from 'zod';

export type Props<FormData extends FieldValues> = {
  schema?: z.ZodType<FormData, FormData>;
  initialFormValues?: DefaultValues<FormData>;
  onSubmit: SubmitHandler<FormData>;
  onConfirm: () => void;
  children: (form?: UseFormReturn<FormData>) => ReactNode;
};

export type ValidatedProps<FormData extends FieldValues> = Omit<
  Props<FormData>,
  'schema' | 'onConfirm'
> & {
  schema: z.ZodType<FormData, FormData>;
};
