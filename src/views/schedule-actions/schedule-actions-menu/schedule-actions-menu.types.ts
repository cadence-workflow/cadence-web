import { type ScheduleActionsEnabledConfig } from '@/config/dynamic/resolvers/schedule-actions-enabled.types';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

import { type ScheduleAction } from '../schedule-actions.types';

export type Props = {
  schedule: DescribeScheduleResponse | undefined;
  actionsEnabledConfig?: ScheduleActionsEnabledConfig;
  onActionSelect: (action: ScheduleAction<any, any, any>) => void;
};
