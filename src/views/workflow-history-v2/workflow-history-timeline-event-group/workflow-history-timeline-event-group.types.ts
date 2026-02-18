import { type HistoryEventsGroup } from '../workflow-history-v2.types';

import { type Props as WorkflowHistoryProps } from '../workflow-history-v2.types';

export type Props = {
  eventGroup: HistoryEventsGroup;
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  onClickShowInTable: () => void;
  onClose: () => void;
};
