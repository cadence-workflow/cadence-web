import { CHART_SIDE_PADDING_PX } from '../../schedule-details-runs-chart.constants';
import resolveChartPixelRange from '../resolve-chart-pixel-range';

describe(resolveChartPixelRange.name, () => {
  it('maps chart width to a padded drawable pixel range', () => {
    expect(
      resolveChartPixelRange({
        widthPx: 800,
        sidePaddingPx: CHART_SIDE_PADDING_PX,
      })
    ).toEqual({
      startPx: CHART_SIDE_PADDING_PX,
      endPx: 800 - CHART_SIDE_PADDING_PX,
    });
  });

  it('returns null when width is zero or negative', () => {
    expect(resolveChartPixelRange({ widthPx: 0 })).toBeNull();
    expect(resolveChartPixelRange({ widthPx: -10 })).toBeNull();
  });

  it('returns null when side padding consumes the full width', () => {
    expect(
      resolveChartPixelRange({
        widthPx: CHART_SIDE_PADDING_PX * 2,
        sidePaddingPx: CHART_SIDE_PADDING_PX,
      })
    ).toBeNull();
  });
});
