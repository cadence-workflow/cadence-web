import { type Control, type UseFormTrigger } from 'react-hook-form';
import { type z } from 'zod';

import { type createScheduleFormSchema } from '../domain-schedules-create-modal/schemas/create-schedule-form-schema';

export type DomainSchedulesCreateFormData = z.infer<
  typeof createScheduleFormSchema
>;

export type Props = {
  control: Control<DomainSchedulesCreateFormData>;
  trigger: UseFormTrigger<DomainSchedulesCreateFormData>;
};
