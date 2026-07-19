import isWorkflowStatus from '@/views/shared/workflow-status-tag/helpers/is-workflow-status';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import { type Props } from './schedule-runs-status-cell.types';

export default function ScheduleRunsStatusCell({ status }: Props) {
  return isWorkflowStatus(status) ? (
    <WorkflowStatusTag status={status} />
  ) : (
    'Unknown'
  );
}
