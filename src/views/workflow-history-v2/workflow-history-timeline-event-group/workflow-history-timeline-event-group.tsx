import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import useGroupDetailsEntries from '../hooks/use-group-details-entries';
import WorkflowHistoryGroupDetails from '../workflow-history-group-details/workflow-history-group-details';
import { type Props as WorkflowHistoryProps } from '../workflow-history-v2.types';

export default function WorkflowHistoryTimelineEventGroup({
  eventGroup,
  decodedPageUrlParams,
  onClose,
}: {
  eventGroup: HistoryEventsGroup;
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  onClose: () => void;
}) {
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
