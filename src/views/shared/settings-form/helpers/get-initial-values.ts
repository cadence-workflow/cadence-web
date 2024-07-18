import { type z } from 'zod';

import {
  type SettingsFormValues,
  type SettingsFormConfig,
} from '../settings-form.types';

export default function getInitialValues<
  D extends object,
  Z extends z.ZodTypeAny,
>({
  data,
  formConfig,
}: {
  data: D;
  formConfig: SettingsFormConfig<D, Z>;
}): SettingsFormValues<Z> {
  return Object.fromEntries(
    formConfig.map((field) => [field.path, field.getInitialValue(data)])
  );
}
