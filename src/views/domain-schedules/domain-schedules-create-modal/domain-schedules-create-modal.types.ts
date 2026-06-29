import { type z } from 'zod';

import {
  type createScheduleFormFieldsSchema,
  type createScheduleFormSchema,
} from './schemas/create-schedule-form-schema';

export type CreateScheduleFormRefineInput = z.infer<
  typeof createScheduleFormFieldsSchema
>;

export type DomainSchedulesCreateFormData = z.infer<
  typeof createScheduleFormSchema
>;

export type Props = {
  domain: string;
  cluster: string;
  isOpen: boolean;
  onClose: () => void;
};
