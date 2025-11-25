import { useCallback } from 'react';

import { Panel } from 'baseui/accordion';
import { MdCircle } from 'react-icons/md';

import formatDate from '@/utils/data-formatters/format-date';
import WorkflowHistoryEventStatusBadge from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryGroupLabel from '@/views/workflow-history/workflow-history-group-label/workflow-history-group-label';
import WorkflowHistoryTimelineResetButton from '@/views/workflow-history/workflow-history-timeline-reset-button/workflow-history-timeline-reset-button';

import workflowHistoryEventFilteringTypeColorsConfig from '../config/workflow-history-event-filtering-type-colors.config';
import useEventGroupDuration from '../hooks/use-event-group-duration';

import getEventGroupFilteringType from './helpers/get-event-group-filtering-type';
import {
  overrides as getOverrides,
  styled,
} from './workflow-history-event-group.styles';
import { type Props } from './workflow-history-event-group.types';

export default function WorkflowHistoryEventGroup({
  eventGroup,
  selected,
  workflowCloseTimeMs,
  workflowCloseStatus,
  workflowIsArchived,
  showLoadingMoreEvents,
  decodedPageUrlParams,
  onReset,
  getIsEventExpanded,
  toggleIsEventExpanded,
}: Props) {
  const {
    status,
    label,
    shortLabel,
    startTimeMs,
    closeTimeMs,
    // expectedEndTimeInfo,
    events,
    eventsMetadata,
    hasMissingEvents,
    // badges,
    resetToDecisionEventId,
  } = eventGroup;

  const eventFilteringType = getEventGroupFilteringType(eventGroup);

  const overrides = getOverrides(eventFilteringType, selected);

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset();
    }
  }, [onReset]);

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

  const lastEventTimeMs = eventsMetadata[eventsMetadata.length - 1].timeMs;

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
          <styled.StatusContainer>
            <WorkflowHistoryEventStatusBadge
              status={status}
              statusReady={!showLoadingMoreEvents}
              size="small"
            />
            {eventsMetadata[eventsMetadata.length - 1].label}
          </styled.StatusContainer>
          <div>{lastEventTimeMs ? formatDate(lastEventTimeMs) : null}</div>
          <div>{eventGroupDuration}</div>
          {/* TODO: add as event details:
              - Existing event details
              - Badges
              - Expected end time info
          */}
          <styled.SummarizedDetailsContainer>
            Placeholder for event details
          </styled.SummarizedDetailsContainer>
          <styled.ActionsContainer>
            {resetToDecisionEventId && (
              <WorkflowHistoryTimelineResetButton
                workflowId={decodedPageUrlParams.workflowId}
                runId={decodedPageUrlParams.runId}
                domain={decodedPageUrlParams.domain}
                cluster={decodedPageUrlParams.cluster}
                onReset={handleReset}
              />
            )}
          </styled.ActionsContainer>
        </styled.HeaderContent>
      }
      expanded={events.some(
        ({ eventId }) => eventId && getIsEventExpanded(eventId)
      )}
      onChange={() =>
        events[0].eventId && toggleIsEventExpanded(events[0].eventId)
      }
      overrides={overrides.panel}
    >
      <div>TODO: Full event details</div>
    </Panel>
  );
}
