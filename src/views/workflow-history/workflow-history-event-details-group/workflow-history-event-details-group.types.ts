import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import { type EventDetailsEntries } from '../workflow-history-event-details/workflow-history-event-details.types';

export type Props = {
  entries: EventDetailsEntries;
  parentGroupPath?: string;
  decodedPageUrlParams: WorkflowPageParams;
};

export type EventDetailsLabelKind = 'regular' | 'group' | 'negative';
