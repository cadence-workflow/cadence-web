import {
  type Control,
  type UseFormClearErrors,
  type UseFormTrigger,
} from 'react-hook-form';

import { type DomainSchedulesCreateFormData } from '../domain-schedules-create-modal/domain-schedules-create-modal.types';

export type Props = {
  control: Control<DomainSchedulesCreateFormData>;
  trigger: UseFormTrigger<DomainSchedulesCreateFormData>;
  clearErrors: UseFormClearErrors<DomainSchedulesCreateFormData>;
  domain: string;
  cluster: string;
  /** Renders the Schedule Id field disabled, for flows where the id is fixed. */
  scheduleIdReadOnly?: boolean;
};
