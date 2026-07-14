import { type ScheduleActionsEnabledConfig } from '@/config/dynamic/resolvers/schedule-actions-enabled.types';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

import { type SelectableScheduleAction } from '../config/schedule-actions.config';

export type Props = {
  schedule: DescribeScheduleResponse | undefined;
  actionsEnabledConfig?: ScheduleActionsEnabledConfig;
  onActionSelect: (action: SelectableScheduleAction) => void;
};
