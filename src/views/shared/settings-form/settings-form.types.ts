import type React from 'react';

import { type SubmitHandler, type Path } from 'react-hook-form';
import { type z } from 'zod';

export type FieldComponentProps<V> = {
  onBlur: (e: any) => void;
  onChange: (e: any) => void;
  value: V;
  error?: string;
};

export type SettingsFormValues<Z extends z.ZodTypeAny> = z.infer<Z>;

export type SettingsFormField<
  D extends object,
  Z extends z.ZodTypeAny,
  K extends keyof SettingsFormValues<Z>,
> = {
  path: K extends Path<SettingsFormValues<Z>> ? K : never;
  title: string;
  description: string;
  getInitialValue: (data: D) => SettingsFormValues<Z>[K];
  component: React.ComponentType<FieldComponentProps<SettingsFormValues<Z>[K]>>;
};

export type SettingsFormConfig<
  D extends object,
  Z extends z.ZodTypeAny,
> = Array<SettingsFormField<D, Z, any>>;

export type Props<D extends object, Z extends z.ZodTypeAny> = {
  data: D;
  zodSchema: Z;
  formConfig: SettingsFormConfig<D, Z>;
  onSubmit: SubmitHandler<SettingsFormValues<Z>>;
  submitButtonText: string;
  onSubmitError: (error: Error) => void;
};
