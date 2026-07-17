import { type Control, type UseFormTrigger } from 'react-hook-form';

import { type DomainSchedulesCreateFormData } from '../domain-schedules-create-modal/domain-schedules-create-modal.types';

export type Props = {
  control: Control<DomainSchedulesCreateFormData>;
  trigger: UseFormTrigger<DomainSchedulesCreateFormData>;
  cluster: string;
};
