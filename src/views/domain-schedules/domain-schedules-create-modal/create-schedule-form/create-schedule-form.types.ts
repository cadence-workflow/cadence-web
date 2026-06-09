import { type z } from 'zod';

import { type Control, type UseFormTrigger } from 'react-hook-form';

import { type createScheduleFormSchema } from '../schemas/create-schedule-form-schema';

export type CreateScheduleFormData = z.infer<typeof createScheduleFormSchema>;

export type Props = {
  control: Control<CreateScheduleFormData>;
  trigger: UseFormTrigger<CreateScheduleFormData>;
};
