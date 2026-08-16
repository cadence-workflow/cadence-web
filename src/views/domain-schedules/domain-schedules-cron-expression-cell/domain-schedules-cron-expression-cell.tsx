import { formatScheduleCronExpression } from '@/views/schedule-details/helpers/format-schedule-cron-expression';

type Props = {
  cronExpression: string;
};

export default function DomainSchedulesCronExpressionCell({
  cronExpression,
}: Props) {
  return formatScheduleCronExpression(cronExpression) ?? cronExpression;
}
