import { toString as cronToString } from 'cronstrue';

type Props = {
  cronExpression: string;
};

export default function DomainSchedulesCronExpressionCell({ cronExpression }: Props) {
  try {
    return `${cronToString(cronExpression)} (${cronExpression})`;
  } catch {
    return cronExpression;
  }
}
