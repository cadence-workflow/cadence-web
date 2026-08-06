import { MdBlock, MdReportGmailerrorred } from 'react-icons/md';

import { WORKFLOW_STATUSES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import getChartStatusIcon from '../get-chart-status-icon';

describe(getChartStatusIcon.name, () => {
  it('maps terminated runs to the same icon as failed and timed out', () => {
    expect(getChartStatusIcon(WORKFLOW_STATUSES.terminated)).toBe(
      MdReportGmailerrorred
    );
    expect(getChartStatusIcon(WORKFLOW_STATUSES.failed)).toBe(
      MdReportGmailerrorred
    );
  });

  it('maps cancelled runs to the block icon', () => {
    expect(getChartStatusIcon(WORKFLOW_STATUSES.canceled)).toBe(MdBlock);
  });
});
