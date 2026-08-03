import { type GetSkippedScheduleTimesMsParams } from '../use-schedule-runs-chart-data.types';

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
