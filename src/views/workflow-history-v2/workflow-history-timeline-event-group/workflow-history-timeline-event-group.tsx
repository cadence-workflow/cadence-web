import useGroupDetailsEntries from '../hooks/use-group-details-entries';
import WorkflowHistoryGroupDetails from '../workflow-history-group-details/workflow-history-group-details';

import { type Props } from './workflow-history-timeline-event-group.types';

export default function WorkflowHistoryTimelineEventGroup({
  eventGroup,
  decodedPageUrlParams,
  onClose,
}: Props) {
  const { groupDetailsEntriesWithSummary } = useGroupDetailsEntries(eventGroup);

  return (
    <WorkflowHistoryGroupDetails
      groupDetailsEntries={groupDetailsEntriesWithSummary}
      initialEventId={undefined}
      workflowPageParams={decodedPageUrlParams}
      onClose={onClose}
    />
  );
}
