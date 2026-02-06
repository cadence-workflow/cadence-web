import cronstrue from 'cronstrue';

import { styled } from './cron-schedule-with-description.styles';

type Props = {
  cronSchedule: string;
};

function getHumanReadableCron(cronSchedule: string): string | null {
  try {
    return cronstrue.toString(cronSchedule);
  } catch {
    return null;
  }
}

export default function CronScheduleWithDescription({ cronSchedule }: Props) {
  const humanReadable = getHumanReadableCron(cronSchedule);

  return (
    <styled.Container>
      <styled.CronExpression>{cronSchedule}</styled.CronExpression>
      {humanReadable && (
        <styled.CronDescription>{humanReadable}</styled.CronDescription>
      )}
    </styled.Container>
  );
}
