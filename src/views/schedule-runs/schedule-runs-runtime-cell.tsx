import FormattedDate from '@/components/formatted-date/formatted-date';

import { styled } from './schedule-runs-runtime-cell.styles';
import { type Props } from './schedule-runs-runtime-cell.types';

export default function ScheduleRunsRuntimeCell({
  startTime,
  closeTime,
}: Props) {
  if (!startTime) return '-';

  return (
    <styled.Container>
      <FormattedDate timestampMs={startTime} /> →
      {closeTime ? <FormattedDate timestampMs={closeTime} /> : 'Running…'}
    </styled.Container>
  );
}
