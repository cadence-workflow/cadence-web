export type Props = {
  cronExpression: string;
};

export type ScheduleCronExpressionParts = {
  expression: string;
  description: string;
  timezone: string;
};
