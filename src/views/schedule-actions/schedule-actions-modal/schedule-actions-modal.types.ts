import { type DefaultValues } from 'react-hook-form';

import { type FormattedScheduleDetails } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

import { type ScheduleAction } from '../schedule-actions.types';

export type Props<Result, FormData, SubmissionData> = {
  domain: string;
  cluster: string;
  scheduleId: string;
  schedule?: FormattedScheduleDetails;
  action: ScheduleAction<Result, FormData, SubmissionData> | undefined;
  onClose: () => void;
  initialFormValues?: DefaultValues<FormData>;
};
