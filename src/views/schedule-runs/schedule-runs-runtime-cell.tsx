import { MdArrowForward } from 'react-icons/md';

import FormattedDate from '@/components/formatted-date/formatted-date';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles } from './schedule-runs-runtime-cell.styles';
import { type Props } from './schedule-runs-runtime-cell.types';

export default function ScheduleRunsRuntimeCell({
  startTime,
  closeTime,
}: Props) {
  const { cls, theme } = useStyletronClasses(cssStyles);

  if (!startTime) {
    return <div className={cls.missingDateContainer}>None</div>;
  }

  return (
    <div className={cls.runtimeContainer}>
      <FormattedDate timestampMs={startTime} />
      <MdArrowForward color={theme.colors.contentSecondary} aria-hidden />
      {closeTime ? (
        <FormattedDate timestampMs={closeTime} />
      ) : (
        <div className={cls.missingDateContainer}>Running…</div>
      )}
    </div>
  );
}
