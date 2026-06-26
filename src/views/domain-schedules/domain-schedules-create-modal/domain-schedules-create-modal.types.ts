import { type z } from 'zod';

import {
  type createScheduleFormFieldsSchema,
  type createScheduleFormSchema,
} from './schemas/create-schedule-form-schema';

export type CreateScheduleFormRefineInput = Pick<
  z.infer<typeof createScheduleFormFieldsSchema>,
  | 'overlapPolicy'
  | 'bufferLimit'
  | 'concurrencyLimit'
  | 'catchUpPolicy'
  | 'catchUpWindowDays'
  | 'startTime'
  | 'endTime'
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
