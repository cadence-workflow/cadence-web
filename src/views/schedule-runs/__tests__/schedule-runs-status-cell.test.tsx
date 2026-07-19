import { render, screen } from '@/test-utils/rtl';

import {
  WORKFLOW_STATUSES,
  WORKFLOW_STATUS_NAMES,
} from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import { type Props as WorkflowStatusTagProps } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import ScheduleRunsStatusCell from '../schedule-runs-status-cell';
import { type Props } from '../schedule-runs-status-cell.types';

jest.mock('@/views/shared/workflow-status-tag/workflow-status-tag', () =>
  jest.fn(({ status }: WorkflowStatusTagProps) => (
    <span>{WORKFLOW_STATUS_NAMES[status]}</span>
  ))
);

describe(ScheduleRunsStatusCell.name, () => {
  it.each(Object.values(WORKFLOW_STATUSES))(
    'renders accessible text for %s',
    (status) => {
      setup(status);
      expect(
        screen.getByText(WORKFLOW_STATUS_NAMES[status])
      ).toBeInTheDocument();
    }
  );

  it('renders a safe fallback for an unknown status', () => {
    setup('UNKNOWN' as Props['status']);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});

function setup(status: Props['status']) {
  render(<ScheduleRunsStatusCell status={status} />);
}
