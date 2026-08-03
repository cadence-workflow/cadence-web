import getSkippedScheduleTimesMs from '../get-skipped-schedule-times-ms';

const HOUR_MS = 60 * 60_000;

describe(getSkippedScheduleTimesMs.name, () => {
  it('returns expected slots with no matching CadenceScheduleTime as skipped', () => {
    expect(
      getSkippedScheduleTimesMs({
        expectedTimesMs: [0, HOUR_MS, 2 * HOUR_MS],
        actualTimesMs: [HOUR_MS],
      })
    ).toEqual([0, 2 * HOUR_MS]);
  });

  it('matches each actual run once', () => {
    expect(
      getSkippedScheduleTimesMs({
        expectedTimesMs: [0, HOUR_MS],
        actualTimesMs: [HOUR_MS],
      })
    ).toEqual([0]);
  });
});
