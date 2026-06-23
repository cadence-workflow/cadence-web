import {
  type Control,
  type FieldErrors,
  type UseFormClearErrors,
  type UseFormTrigger,
} from 'react-hook-form';

import { type DomainSchedulesCreateFormData } from '../domain-schedules-create-modal/domain-schedules-create-modal.types';

export type Props = {
  control: Control<DomainSchedulesCreateFormData>;
  fieldErrors: FieldErrors<DomainSchedulesCreateFormData>;
  trigger?: UseFormTrigger<DomainSchedulesCreateFormData>;
  isSubmitted?: boolean;
  clearErrors: UseFormClearErrors<DomainSchedulesCreateFormData>;
};
