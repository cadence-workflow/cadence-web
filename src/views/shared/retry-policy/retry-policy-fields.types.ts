import {
  type Control,
  type FieldErrors,
  type UseFormClearErrors,
} from 'react-hook-form';

import { type RetryPolicyFormFields } from './retry-policy-form.schema';

export type Props<TFieldValues extends RetryPolicyFormFields> = {
  control: Control<TFieldValues>;
  clearErrors: UseFormClearErrors<TFieldValues>;
  fieldErrors: FieldErrors<TFieldValues>;
  variant: 'horizontal' | 'compact';
  idPrefix?: string;
};

type InnerProps = {
  control: Control<RetryPolicyFormFields>;
  clearErrors: UseFormClearErrors<RetryPolicyFormFields>;
  fieldErrors: FieldErrors<RetryPolicyFormFields>;
  variant: 'horizontal' | 'compact';
  idPrefix?: string;
};

export type { InnerProps };
