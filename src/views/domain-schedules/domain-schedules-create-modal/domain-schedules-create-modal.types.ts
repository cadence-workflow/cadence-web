import { type z } from 'zod';

import { type createScheduleFormSchema } from './schemas/create-schedule-form-schema';

export type DomainSchedulesCreateFormData = z.infer<
  typeof createScheduleFormSchema
>;

export type Props = {
  domain: string;
  cluster: string;
  isOpen: boolean;
  onClose: () => void;
};
