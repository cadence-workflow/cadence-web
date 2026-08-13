import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import {
  type EventDetailsGroupEntry,
  type EventDetailsSingleEntry,
} from '../workflow-history-event-details/workflow-history-event-details.types';

export type Props = {
  detail: EventDetailsSingleEntry | EventDetailsGroupEntry;
} & WorkflowPageParams;
