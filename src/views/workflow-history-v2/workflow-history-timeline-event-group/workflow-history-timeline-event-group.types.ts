import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import { type Props as WorkflowHistoryProps } from '../workflow-history-v2.types';

export type Props = {
  eventGroup: HistoryEventsGroup;
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  onClickShowInTable: () => void;
  onClose: () => void;
};
