import { Panel } from 'baseui/accordion';
import { Badge } from 'baseui/badge';
import { MdCircle } from 'react-icons/md';

import WorkflowHistoryEventStatusBadge from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryEventsDurationBadge from '@/views/workflow-history/workflow-history-events-duration-badge/workflow-history-events-duration-badge';
import WorkflowHistoryGroupLabel from '@/views/workflow-history/workflow-history-group-label/workflow-history-group-label';
import WorkflowHistoryRemainingDurationBadge from '@/views/workflow-history/workflow-history-remaining-duration-badge/workflow-history-remaining-duration-badge';

import workflowHistoryEventFilteringTypeColorsConfig from '../config/workflow-history-event-filtering-type-colors.config';
import useEventGroupDuration from '../hooks/use-event-group-duration';

import getEventFilteringType from './helpers/get-event-filtering-type';
import {
  overrides as getOverrides,
  styled,
} from './workflow-history-event-group.styles';
import { type Props } from './workflow-history-event-group.types';

export default function WorkflowHistoryEventGroup({
  status,
  label,
  shortLabel,
  timeLabel,
  startTimeMs,
  closeTimeMs,
  expectedEndTimeInfo,
  workflowCloseTimeMs,
  workflowCloseStatus,
  workflowIsArchived,
  events,
  isLastEvent,
  eventsMetadata,
  hasMissingEvents,
  showLoadingMoreEvents,
  decodedPageUrlParams,
  badges,
  resetToDecisionEventId,
  onReset,
  selected,
}: Props) {
  // Check each filter function against the event and return the one that matches, and OTHER otherwise
  const eventFilteringType = getEventFilteringType(events);

  const overrides = getOverrides(eventFilteringType);
  const hasBadges = badges !== undefined && badges.length > 0;

  const eventGroupDuration = useEventGroupDuration({
    startTime: startTimeMs,
    closeTime: closeTimeMs,
    workflowIsArchived,
    eventsCount: events.length,
    workflowCloseStatus,
    loadingMoreEvents: showLoadingMoreEvents,
    hasMissingEvents,
    workflowCloseTime: workflowCloseTimeMs,
  });

  return (
    <Panel
      title={
        <styled.HeaderContent>
          <MdCircle
            color={
              workflowHistoryEventFilteringTypeColorsConfig[eventFilteringType]
                .content
            }
          />
          <styled.HeaderLabel>
            <WorkflowHistoryGroupLabel label={label} shortLabel={shortLabel} />
          </styled.HeaderLabel>
          <styled.HeaderStatus>
            <WorkflowHistoryEventStatusBadge
              status={status}
              statusReady={!showLoadingMoreEvents}
              size="medium"
            />
            {eventsMetadata[eventsMetadata.length - 1].label}
          </styled.HeaderStatus>
          <div>{timeLabel}</div>
          <div>{eventGroupDuration}</div>
        </styled.HeaderContent>
      }
      overrides={overrides.panel}
    >
      <div>TODO</div>
    </Panel>
  );
}
