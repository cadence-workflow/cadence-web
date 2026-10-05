import { type ComponentType } from 'react';

import {
  type Control,
  type FieldErrors,
  type UseFormClearErrors,
} from 'react-hook-form';

import { type FieldComponentProps } from './retry-policy-fields-wrapper/retry-policy-fields-wrapper.types';
import { type RetryPolicyFormFields } from './schemas/retry-policy-form-schema';

export type Props<TFieldValues extends RetryPolicyFormFields> = {
  control: Control<TFieldValues>;
  clearErrors: UseFormClearErrors<TFieldValues>;
  fieldErrors: FieldErrors<TFieldValues>;
  idPrefix?: string;
  fieldComponent?: ComponentType<FieldComponentProps>;
};

export type RetryPolicyBody = {
  initialIntervalSeconds?: number;
  backoffCoefficient?: number;
  maximumIntervalSeconds?: number;
  maximumAttempts?: number;
  expirationIntervalSeconds?: number;
};
