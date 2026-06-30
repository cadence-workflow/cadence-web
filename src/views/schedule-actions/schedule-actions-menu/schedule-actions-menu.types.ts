import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

import { type ScheduleAction } from '../schedule-actions.types';

export type Props = {
  schedule: DescribeScheduleResponse | undefined;
  onActionSelect: (action: ScheduleAction<any, any, any>) => void;
};
