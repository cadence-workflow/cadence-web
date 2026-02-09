import { useMemo } from 'react';

import { toString as cronToString } from 'cronstrue';

import { styled } from './cron-schedule-description.styles';
import type { Props } from './cron-schedule-description.types';

export default function CronScheduleWithDescription({ cronSchedule }: Props) {
  const humanReadable = useMemo(() => {
    try {
      return cronToString(cronSchedule);
    } catch {
      return null;
    }
  }, [cronSchedule]);

  return (
    <styled.Container>
      <styled.CronExpression>{cronSchedule} </styled.CronExpression>
      {humanReadable && (
        <styled.CronDescription>({humanReadable})</styled.CronDescription>
      )}
    </styled.Container>
  );
}
