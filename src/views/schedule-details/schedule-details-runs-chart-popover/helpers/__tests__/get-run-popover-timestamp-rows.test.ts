import {
  RUN_POPOVER_EMPTY_VALUE,
  RUN_POPOVER_TIMESTAMP_LABELS,
} from '../../schedule-details-runs-chart-popover.constants';
import getRunPopoverTimestampRows from '../get-run-popover-timestamp-rows';

describe(getRunPopoverTimestampRows.name, () => {
  it('formats each timestamp into a labeled row, in scheduled/started/ended order', () => {
    const rows = getRunPopoverTimestampRows({
      scheduledTimeMs: Date.UTC(2024, 0, 1, 10, 0),
      startedTimeMs: Date.UTC(2024, 0, 1, 10, 1),
      endedTimeMs: Date.UTC(2024, 0, 1, 10, 5),
    });

    expect(rows.map((row) => row.label)).toEqual([
      RUN_POPOVER_TIMESTAMP_LABELS.scheduled,
      RUN_POPOVER_TIMESTAMP_LABELS.started,
      RUN_POPOVER_TIMESTAMP_LABELS.ended,
    ]);
    expect(rows.map((row) => row.value)).not.toContain(RUN_POPOVER_EMPTY_VALUE);
  });

  it('renders the empty value placeholder for null timestamps', () => {
    const rows = getRunPopoverTimestampRows({
      scheduledTimeMs: Date.UTC(2024, 0, 1, 10, 0),
      startedTimeMs: null,
      endedTimeMs: null,
    });

    expect(rows[1].value).toBe(RUN_POPOVER_EMPTY_VALUE);
    expect(rows[2].value).toBe(RUN_POPOVER_EMPTY_VALUE);
  });
});
