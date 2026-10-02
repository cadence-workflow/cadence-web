import { act } from '@testing-library/react';

import { renderHook } from '@/test-utils/rtl';

import { CHART_GLYPH_ENTER_ANIMATION_MS } from '../schedule-details-runs-chart.constants';
import useNewChartTimesMs from '../use-new-chart-times-ms';

const MINUTE_MS = 60_000;

describe(useNewChartTimesMs.name, () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not animate the glyphs the chart opened with', () => {
    const { result } = setup({ timesMs: [MINUTE_MS, 2 * MINUTE_MS] });

    expect(result.current.size).toBe(0);
  });

  it('animates a glyph that arrives while the chart is open, until it has played', () => {
    const { result, rerender } = setup({
      timesMs: [MINUTE_MS, 2 * MINUTE_MS],
    });

    rerender({
      timesMs: [MINUTE_MS, 2 * MINUTE_MS, 3 * MINUTE_MS],
      isEnabled: true,
    });

    expect(Array.from(result.current)).toEqual([3 * MINUTE_MS]);

    act(() => {
      jest.advanceTimersByTime(CHART_GLYPH_ENTER_ANIMATION_MS);
    });

    expect(result.current.size).toBe(0);
  });

  it('ignores older glyphs loaded by paging back through history', () => {
    const { result, rerender } = setup({
      timesMs: [2 * MINUTE_MS, 3 * MINUTE_MS],
    });

    rerender({
      timesMs: [MINUTE_MS, 2 * MINUTE_MS, 3 * MINUTE_MS],
      isEnabled: true,
    });

    expect(result.current.size).toBe(0);
  });

  it('treats the first loaded snapshot as the baseline, not as arrivals', () => {
    const { result, rerender } = setup({ timesMs: [], isEnabled: false });

    rerender({ timesMs: [MINUTE_MS, 2 * MINUTE_MS], isEnabled: true });

    expect(result.current.size).toBe(0);
  });

  it('animates the first glyph of a series that had none', () => {
    const { result, rerender } = setup({ timesMs: [] });

    rerender({ timesMs: [MINUTE_MS], isEnabled: true });

    expect(Array.from(result.current)).toEqual([MINUTE_MS]);
  });

  it('animates a single-glyph series moving forward, as the next run does', () => {
    const { result, rerender } = setup({ timesMs: [15 * MINUTE_MS] });

    rerender({ timesMs: [30 * MINUTE_MS], isEnabled: true });

    expect(Array.from(result.current)).toEqual([30 * MINUTE_MS]);
  });
});

type Params = Parameters<typeof useNewChartTimesMs>[0];

function setup(initialProps: Partial<Params> = {}) {
  return renderHook(
    (props?: Params) =>
      useNewChartTimesMs(props ?? { timesMs: [], isEnabled: true }),
    undefined,
    {
      initialProps: { timesMs: [], isEnabled: true, ...initialProps },
    }
  );
}
