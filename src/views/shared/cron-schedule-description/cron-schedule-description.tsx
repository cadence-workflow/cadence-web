import cronstrue from 'cronstrue';

import { styled } from './cron-schedule-description.styles';

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
      <styled.CronExpression>
        {cronSchedule}
        {humanReadable && ` [${humanReadable}]`}
      </styled.CronExpression>
    </styled.Container>
  );
}