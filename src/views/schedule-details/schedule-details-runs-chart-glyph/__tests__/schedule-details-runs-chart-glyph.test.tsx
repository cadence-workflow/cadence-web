import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import ScheduleDetailsRunsChartGlyph from '../schedule-details-runs-chart-glyph';
import { CHART_GLYPH_TEST_IDS } from '../schedule-details-runs-chart-glyph.constants';
import { type Props } from '../schedule-details-runs-chart-glyph.types';

const COMPLETED_LABEL = 'Completed schedule run run-1';

describe(ScheduleDetailsRunsChartGlyph.name, () => {
  it('renders a single marker with an accessible label', () => {
    setup({ variant: WORKFLOW_STATUSES.completed, label: COMPLETED_LABEL });

    expect(
      screen.getByRole('img', { name: COMPLETED_LABEL })
    ).toBeInTheDocument();
  });

  it('renders a grouped count when more than one run shares the position', () => {
    setup({
      variant: WORKFLOW_STATUSES.completed,
      runCount: 3,
      label: '3 schedule runs',
    });

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders a backfill badge for an individual backfill run', () => {
    setup({
      variant: WORKFLOW_STATUSES.completed,
      isBackfill: true,
      label: COMPLETED_LABEL,
    });

    expect(
      screen.getByTestId(CHART_GLYPH_TEST_IDS.backfillBadge)
    ).toBeInTheDocument();
  });

  it('renders a loading marker for a pending execution', () => {
    setup({ variant: 'pending', label: 'Loading run' });

    expect(
      screen.getByRole('img', { name: 'Loading run' })
    ).toBeInTheDocument();
  });

  it('omits the backfill badge for grouped markers', () => {
    setup({
      variant: WORKFLOW_STATUSES.completed,
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
    <ScheduleDetailsRunsChartGlyph x={10} y={20} testId="glyph" {...props} />
  );
}
