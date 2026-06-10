import { type DescribeScheduleDTO } from '@/route-handlers/describe-schedule/describe-schedule.types';

export type UseDescribeScheduleParams = {
  domain: string;
  cluster: string;
  scheduleId: string;
};

export type DescribeScheduleQueryKey = [
  'describeSchedule',
  UseDescribeScheduleParams,
];

export type { DescribeScheduleDTO };
