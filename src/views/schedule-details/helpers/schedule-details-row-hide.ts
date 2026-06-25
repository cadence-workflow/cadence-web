import { type ScheduleDetailRowConfig } from '@/views/schedule-details/schedule-details.types';

export const hideWithoutRetryPolicy: ScheduleDetailRowConfig['hide'] = ({
  describeSchedule,
}) => !describeSchedule.action?.startWorkflow?.retryPolicy;
