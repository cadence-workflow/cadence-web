import React from 'react';

import { render } from '@/test-utils/rtl';
import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import ScheduleDetailsRunsChartLegendIcon from '../schedule-details-runs-chart-legend-icon';
import { type ChartLegendVariant } from '../schedule-details-runs-chart-legend-icon.types';

describe(ScheduleDetailsRunsChartLegendIcon.name, () => {
  it.each<ChartLegendVariant>([
    WORKFLOW_STATUSES.completed,
    WORKFLOW_STATUSES.failed,
    WORKFLOW_STATUSES.running,
    WORKFLOW_STATUSES.canceled,
    'skipped',
    'next',
  ])('renders the %s legend icon', (variant) => {
    const { container } = setup({ variant });

    expect(container.firstChild).toBeTruthy();
  });
});

function setup({ variant }: { variant: ChartLegendVariant }) {
  return render(<ScheduleDetailsRunsChartLegendIcon variant={variant} size={12} />);
}
