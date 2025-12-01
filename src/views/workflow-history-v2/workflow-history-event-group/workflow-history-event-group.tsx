import { useCallback, useMemo } from 'react';

import { Panel } from 'baseui/accordion';
import { MdCircle } from 'react-icons/md';

import formatDate from '@/utils/data-formatters/format-date';
import formatPendingWorkflowHistoryEvent from '@/utils/data-formatters/format-pending-workflow-history-event';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import isPendingHistoryEvent from '@/views/workflow-history/workflow-history-event-details/helpers/is-pending-history-event';
import WorkflowHistoryEventStatusBadge from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryGroupLabel from '@/views/workflow-history/workflow-history-group-label/workflow-history-group-label';
import WorkflowHistoryTimelineResetButton from '@/views/workflow-history/workflow-history-timeline-reset-button/workflow-history-timeline-reset-button';

import workflowHistoryEventFilteringTypeColorsConfig from '../config/workflow-history-event-filtering-type-colors.config';
import generateHistoryEventDetails from '../helpers/generate-history-event-details';
import WorkflowHistoryEventGroupDuration from '../workflow-history-event-group-duration/workflow-history-event-group-duration';
import WorkflowHistoryGroupDetails from '../workflow-history-group-details/workflow-history-group-details';
import { type GroupDetails } from '../workflow-history-group-details/workflow-history-group-details.types';

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

  const eventGroupDetails: GroupDetails = useMemo(() => {
    return Object.fromEntries(
      eventGroup.events.map((event, index) => {
        const eventMetadata = eventGroup.eventsMetadata[index];

        const result = isPendingHistoryEvent(event)
          ? formatPendingWorkflowHistoryEvent(event)
          : formatWorkflowHistoryEvent(event);

        const eventDetails = result
          ? generateHistoryEventDetails({
              details: {
                ...result,
                ...eventMetadata.additionalDetails,
              },
              negativeFields: eventMetadata.negativeFields,
            })
          : [];

        return [
          event.eventId,
          {
            eventLabel: eventMetadata.label,
            eventDetails,
          } satisfies GroupDetails[string],
        ];
      })
    );
  }, [eventGroup.events, eventGroup.eventsMetadata]);

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
            {eventsMetadata.at(-1)?.label}
          </styled.StatusContainer>
          <div>{eventGroup.timeMs ? formatDate(eventGroup.timeMs) : null}</div>
          <WorkflowHistoryEventGroupDuration
            startTime={startTimeMs}
            closeTime={closeTimeMs}
            workflowIsArchived={workflowIsArchived}
            eventsCount={events.length}
            workflowCloseStatus={workflowCloseStatus}
            loadingMoreEvents={showLoadingMoreEvents}
            hasMissingEvents={hasMissingEvents}
            workflowCloseTime={workflowCloseTimeMs}
            expectedEndTimeInfo={eventGroup.expectedEndTimeInfo}
          />
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
      onChange={() => {
        if (events.length > 0 && events[0].eventId)
          toggleIsEventExpanded(events[0].eventId);
      }}
      overrides={overrides.panel}
    >
      <styled.GroupDetailsGridContainer>
        <styled.GroupDetailsNameSpacer />
        <styled.GroupDetailsContainer>
          <WorkflowHistoryGroupDetails
            groupDetails={eventGroupDetails}
            initialEventId={
              events.find(
                ({ eventId }) => eventId && getIsEventExpanded(eventId)
              )?.eventId ?? undefined
            }
            workflowPageParams={decodedPageUrlParams}
            onClose={() =>
              eventGroup.events.map(({ eventId }) => {
                if (eventId && getIsEventExpanded(eventId))
                  toggleIsEventExpanded(eventId);
              })
            }
          />
        </styled.GroupDetailsContainer>
      </styled.GroupDetailsGridContainer>
    </Panel>
  );
}
