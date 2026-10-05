import { type DescribeScheduleResponse } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

type ScheduleState = NonNullable<DescribeScheduleResponse['state']>;

export type Props = Pick<ScheduleState, 'paused' | 'pauseInfo'>;
