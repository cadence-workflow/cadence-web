import getScheduleCronExpressionParts from './helpers/get-schedule-cron-expression-parts';
import { styled } from './schedule-cron-expression.styles';
import { type Props } from './schedule-cron-expression.types';

export default function ScheduleCronExpression({ cronExpression }: Props) {
  const parts = getScheduleCronExpressionParts(cronExpression);

  if (!parts) {
    return <styled.CronExpression>{cronExpression}</styled.CronExpression>;
  }

  return (
    <styled.Root>
      {parts.description}, {parts.timezone}
      <styled.CronExpression>{parts.expression}</styled.CronExpression>
    </styled.Root>
  );
}
