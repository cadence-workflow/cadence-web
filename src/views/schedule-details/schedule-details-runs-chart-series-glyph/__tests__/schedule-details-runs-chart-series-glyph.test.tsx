import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import ScheduleDetailsRunsChartSeriesGlyph from '../schedule-details-runs-chart-series-glyph';
import { CHART_GLYPH_TEST_IDS } from '../schedule-details-runs-chart-series-glyph.constants';
import { type Props } from '../schedule-details-runs-chart-series-glyph.types';

describe(ScheduleDetailsRunsChartSeriesGlyph.name, () => {
  it('renders a single marker with an accessible label', () => {
    setup({ variant: 'completed', label: 'Completed schedule run run-1' });

    expect(
      screen.getByRole('img', { name: 'Completed schedule run run-1' })
    ).toBeInTheDocument();
  });

  it('renders a grouped count instead of a status icon when more than one run shares the position', () => {
    setup({ variant: 'completed', runCount: 3, label: '3 schedule runs' });

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders a backfill badge for an individual backfill run', () => {
    setup({
      variant: 'completed',
      isBackfill: true,
      label: 'Completed schedule run run-1',
    });

    expect(
      screen.getByTestId(CHART_GLYPH_TEST_IDS.backfillBadge)
    ).toBeInTheDocument();
  });

  it('omits the backfill badge for grouped markers', () => {
    setup({
      variant: 'completed',
      runCount: 2,
      isBackfill: true,
      label: '2 schedule runs',
    });

    expect(
      screen.queryByTestId(CHART_GLYPH_TEST_IDS.backfillBadge)
    ).not.toBeInTheDocument();
  });
});

function setup(props: Omit<Props, 'x' | 'y' | 'testId'>) {
  render(
    <ScheduleDetailsRunsChartSeriesGlyph
      x={10}
      y={20}
      testId="glyph"
      {...props}
    />
  );
}
