import { type z } from 'zod';

import { type ScheduleActionFormProps } from '../schedule-actions.types';

import { type backfillScheduleFormSchema } from './schemas/backfill-schedule-form-schema';

export type BackfillScheduleFormData = z.infer<typeof backfillScheduleFormSchema>;

export type Props = Pick<
  ScheduleActionFormProps<BackfillScheduleFormData>,
  'fieldErrors' | 'control' | 'trigger' | 'schedule'
> & {
  isSubmitted?: boolean;
};
