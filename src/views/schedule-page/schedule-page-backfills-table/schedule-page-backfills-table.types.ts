import { type DescribeScheduleResponse } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

export type BackfillInfo = NonNullable<
  DescribeScheduleResponse['info']
>['ongoingBackfills'][number];

export type Props = {
  backfills: BackfillInfo[];
  domain: string;
  cluster: string;
};
