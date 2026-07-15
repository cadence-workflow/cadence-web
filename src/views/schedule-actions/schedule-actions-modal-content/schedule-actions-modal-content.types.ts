import { type DefaultValues } from 'react-hook-form';

import { type FormattedScheduleDetails } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

import {
  type ScheduleAction,
  type ScheduleActionInputParams,
} from '../schedule-actions.types';

export type Props<Result, FormData, SubmissionData> = {
  action: ScheduleAction<Result, FormData, SubmissionData>;
  params: ScheduleActionInputParams;
  schedule?: FormattedScheduleDetails;
  onCloseModal: () => void;
  initialFormValues?: DefaultValues<FormData>;
};
