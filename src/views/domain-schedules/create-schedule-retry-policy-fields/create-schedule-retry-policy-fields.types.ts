import {
  type Control,
  type FieldErrors,
  type UseFormClearErrors,
} from 'react-hook-form';

import { type DomainSchedulesCreateFormData } from '@/views/domain-schedules/domain-schedules-create-modal/domain-schedules-create-modal.types';

export type Props = {
  control: Control<DomainSchedulesCreateFormData>;
  clearErrors: UseFormClearErrors<DomainSchedulesCreateFormData>;
  fieldErrors: FieldErrors<DomainSchedulesCreateFormData>;
};
