import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import { type WorkflowHistoryEventDetailsEntries } from '../workflow-history-event-details/workflow-history-event-details.types';

export type Props = {
  entries: WorkflowHistoryEventDetailsEntries;
  parentGroupPath?: string;
  decodedPageUrlParams: WorkflowPageTabsParams;
};
