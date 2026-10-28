import { type DefaultValues, type FieldValues } from 'react-hook-form';

import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

import { type ScheduleAction } from '../schedule-actions.types';

export type Props<Result, FormData extends FieldValues, SubmissionData> = {
  domain: string;
  cluster: string;
  scheduleId: string;
  schedule?: DescribeScheduleResponse;
  action: ScheduleAction<Result, FormData, SubmissionData> | undefined;
  onClose: () => void;
  initialFormValues?: DefaultValues<FormData>;
};
