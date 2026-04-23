import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';
import { type Props as ColumnsPickerProps } from '@/views/shared/workflows-list-columns-picker/workflows-list-columns-picker.types';

export type Props = {
  domain: string;
  cluster: string;
  columnsPickerProps?: ColumnsPickerProps;
  timeRangeStart: string;
  timeRangeEnd: string;
};

export type WorkflowStatusClosed = Exclude<
  WorkflowStatus,
  'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
>;
