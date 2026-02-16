import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import { type EventDetailsEntries } from '../workflow-history-event-details/workflow-history-event-details.types';

export type EventDetailsTabContent = {
  eventDetails: EventDetailsEntries;
  eventLabel: string;
};

export type GroupDetailsEntries = Array<[string, EventDetailsTabContent]>;

export type Props = {
  groupDetailsEntries: GroupDetailsEntries;
  initialEventId: string | undefined;
  isUngroupedView?: boolean;
  workflowPageParams: WorkflowPageParams;
  onClose?: () => void;
  onClickShowInTimeline?: () => void;
  onClickShowInTable?: () => void;
};
