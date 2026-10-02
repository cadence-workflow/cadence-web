import { type z } from 'zod';

import { type ScheduleActionFormProps } from '../schedule-actions.types';

import { type pauseScheduleFormSchema } from './schemas/pause-schedule-form-schema';

export type PauseScheduleFormData = z.infer<typeof pauseScheduleFormSchema>;

export type Props = Pick<
  ScheduleActionFormProps<PauseScheduleFormData>,
  'fieldErrors' | 'control'
>;
