import { type GetSkippedScheduleTimesMsParams } from './get-skipped-schedule-times-ms.types';

export default function getSkippedScheduleTimesMs({
  expectedTimesMs,
  actualTimesMs,
}: GetSkippedScheduleTimesMsParams): number[] {
  const unmatchedActualTimesMs = [...actualTimesMs];

  return expectedTimesMs.filter((expectedTimeMs) => {
    const matchIndex = unmatchedActualTimesMs.indexOf(expectedTimeMs);
    if (matchIndex < 0) {
      return true;
    }

    unmatchedActualTimesMs.splice(matchIndex, 1);
    return false;
  });
}
