import { type Control, type UseFormClearErrors, type UseFormTrigger } from 'react-hook-form';

import { type DomainSchedulesCreateFormData } from '../domain-schedules-create-modal/domain-schedules-create-modal.types';

export type Props = {
  control: Control<DomainSchedulesCreateFormData>;
  trigger: UseFormTrigger<DomainSchedulesCreateFormData>;
  clearErrors: UseFormClearErrors<DomainSchedulesCreateFormData>;
};
