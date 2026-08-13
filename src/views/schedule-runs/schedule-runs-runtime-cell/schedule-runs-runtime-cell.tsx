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
      <div className={cls.noShrink}>
        <FormattedDate timestampMs={startTime} />
      </div>
      <MdArrowForward
        className={cls.noShrink}
        color={theme.colors.contentSecondary}
        aria-hidden
      />
      <div className={cls.noShrink}>
        <FormattedDate timestampMs={closeTime} />
      </div>
    </div>
  );
}
