import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

import {
  type ScheduleAction,
  type ScheduleActionInputParams,
} from '../schedule-actions.types';

export type Props<Result, FormData, SubmissionData> = {
  action: ScheduleAction<Result, FormData, SubmissionData>;
  params: ScheduleActionInputParams;
  schedule?: DescribeScheduleResponse;
  onCloseModal: () => void;
};
