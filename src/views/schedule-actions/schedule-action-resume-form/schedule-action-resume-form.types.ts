import { type z } from 'zod';

import { type ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';

import { type ScheduleActionFormProps } from '../schedule-actions.types';

import { type resumeScheduleFormSchema } from './schemas/resume-schedule-form-schema';

export type ResumeScheduleFormData = z.infer<typeof resumeScheduleFormSchema>;

export type ResumeScheduleSubmissionData = {
  reason?: string;
  catchUpPolicy?: ScheduleCatchUpPolicy;
};

export type Props = Pick<
  ScheduleActionFormProps<ResumeScheduleFormData>,
  'fieldErrors' | 'control'
>;
