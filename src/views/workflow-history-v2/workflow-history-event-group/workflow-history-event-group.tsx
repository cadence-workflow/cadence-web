import { useCallback, useMemo } from 'react';

import { Panel } from 'baseui/accordion';
import { MdCircle } from 'react-icons/md';

import formatDate from '@/utils/data-formatters/format-date';
import WorkflowHistoryEventStatusBadge from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryGroupLabel from '@/views/workflow-history/workflow-history-group-label/workflow-history-group-label';
import WorkflowHistoryTimelineResetButton from '@/views/workflow-history/workflow-history-timeline-reset-button/workflow-history-timeline-reset-button';

import workflowHistoryEventFilteringTypeColorsConfig from '../config/workflow-history-event-filtering-type-colors.config';
import useGroupDetailsEntries from '../hooks/use-group-details-entries';
import WorkflowHistoryDetailsRow from '../workflow-history-details-row/workflow-history-details-row';
import WorkflowHistoryEventGroupDuration from '../workflow-history-event-group-duration/workflow-history-event-group-duration';
import WorkflowHistoryGroupDetails from '../workflow-history-group-details/workflow-history-group-details';

import getEventGroupFilteringType from './helpers/get-event-group-filtering-type';
import {
  overrides as getOverrides,
  styled,
} from './workflow-history-event-group.styles';
import { type Props } from './workflow-history-event-group.types';

export default function WorkflowHistoryEventGroup({
  eventGroup,
  selectedEventId,
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
    timeMs,
    startTimeMs,
    closeTimeMs,
    expectedEndTimeInfo,
    events,
    eventsMetadata,
    hasMissingEvents,
    resetToDecisionEventId,
  } = eventGroup;

  const eventFilteringType = getEventGroupFilteringType(eventGroup);

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  const { groupSummaryDetails, groupDetailsEntriesWithSummary } =
    useGroupDetailsEntries(eventGroup);

  const handleGroupExpansionStateChange = useCallback(
    (newExpanded: boolean) => {
      events.forEach(({ eventId }) => {
        if (eventId && getIsEventExpanded(eventId) !== newExpanded)
          toggleIsEventExpanded(eventId);
      });
    },
    [events, getIsEventExpanded, toggleIsEventExpanded]
  );

  const animateOnEnter = useMemo(
    () =>
      groupDetailsEntriesWithSummary.some(
        ([eventId]) => eventId === selectedEventId
      ),
    [groupDetailsEntriesWithSummary, selectedEventId]
  );

  const overrides = getOverrides(eventFilteringType, animateOnEnter);

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
          <div>{timeMs ? formatDate(timeMs) : null}</div>
          <div>
            <WorkflowHistoryEventGroupDuration
              startTime={startTimeMs}
              closeTime={closeTimeMs}
              workflowIsArchived={workflowIsArchived}
              eventsCount={events.length}
              workflowCloseStatus={workflowCloseStatus}
              loadingMoreEvents={showLoadingMoreEvents}
              hasMissingEvents={hasMissingEvents}
              workflowCloseTime={workflowCloseTimeMs}
              expectedEndTimeInfo={expectedEndTimeInfo}
            />
          </div>
          <styled.SummarizedDetailsContainer>
            <WorkflowHistoryDetailsRow
              detailsEntries={groupSummaryDetails}
              {...decodedPageUrlParams}
            />
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
      onChange={({ expanded }) => handleGroupExpansionStateChange(expanded)}
      overrides={overrides.panel}
    >
      <styled.GroupDetailsGridContainer>
        <styled.GroupDetailsNameSpacer />
        <styled.GroupDetailsContainer>
          <WorkflowHistoryGroupDetails
            groupDetailsEntries={groupDetailsEntriesWithSummary}
            initialEventId={selectedEventId}
            workflowPageParams={decodedPageUrlParams}
            onClose={() => handleGroupExpansionStateChange(false)}
          />
        </styled.GroupDetailsContainer>
      </styled.GroupDetailsGridContainer>
    </Panel>
  );
}
