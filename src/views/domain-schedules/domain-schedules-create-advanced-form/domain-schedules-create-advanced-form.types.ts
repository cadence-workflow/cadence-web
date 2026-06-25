import { type Control, type FieldErrors } from 'react-hook-form';

import { type DomainSchedulesCreateFormData } from '../domain-schedules-create-modal/domain-schedules-create-modal.types';

export type Props = {
  control: Control<DomainSchedulesCreateFormData>;
  fieldErrors: FieldErrors<DomainSchedulesCreateFormData>;
};
