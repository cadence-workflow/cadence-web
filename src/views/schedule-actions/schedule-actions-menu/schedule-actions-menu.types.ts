import { type ScheduleActionsEnabledConfig } from '@/config/dynamic/resolvers/schedule-actions-enabled.types';
import { type FormattedScheduleDetails } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

import { type SelectableScheduleAction } from '../config/schedule-actions.config';

export type Props = {
  schedule: FormattedScheduleDetails | undefined;
  actionsEnabledConfig?: ScheduleActionsEnabledConfig;
  onActionSelect: (action: SelectableScheduleAction) => void;
};
