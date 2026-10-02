import { LightTheme } from 'baseui';

import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import getChartGlyphColor from '../get-chart-glyph-color';

describe(getChartGlyphColor.name, () => {
  it('maps terminated runs to the same negative channel as failed and timed out', () => {
    expect(getChartGlyphColor(LightTheme, WORKFLOW_STATUSES.terminated)).toBe(
      LightTheme.colors.negative400
    );
    expect(getChartGlyphColor(LightTheme, WORKFLOW_STATUSES.failed)).toBe(
      LightTheme.colors.negative400
    );
  });

  it('maps cancelled runs to the warning channel', () => {
    expect(getChartGlyphColor(LightTheme, WORKFLOW_STATUSES.canceled)).toBe(
      LightTheme.colors.warning400
    );
  });
});
