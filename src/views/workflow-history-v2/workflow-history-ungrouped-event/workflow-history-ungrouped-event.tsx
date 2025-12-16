import { useCallback, useMemo } from 'react';

import { Panel } from 'baseui/accordion';
import { MdOutlineCircle } from 'react-icons/md';

import formatDate from '@/utils/data-formatters/format-date';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import WorkflowHistoryEventStatusBadge from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryGroupLabel from '@/views/workflow-history/workflow-history-group-label/workflow-history-group-label';
import WorkflowHistoryTimelineResetButton from '@/views/workflow-history/workflow-history-timeline-reset-button/workflow-history-timeline-reset-button';

import workflowHistoryEventFilteringTypeColorsConfig from '../config/workflow-history-event-filtering-type-colors.config';
import generateHistoryGroupDetails from '../helpers/generate-history-group-details';
import WorkflowHistoryDetailsRow from '../workflow-history-details-row/workflow-history-details-row';
import getEventGroupFilteringType from '../workflow-history-event-group/helpers/get-event-group-filtering-type';
import getSummaryTabContentEntry from '../workflow-history-event-group/helpers/get-summary-tab-content-entry';
import getFormattedEventsDuration from '../workflow-history-event-group-duration/helpers/get-formatted-events-duration';
import WorkflowHistoryGroupDetails from '../workflow-history-group-details/workflow-history-group-details';

import {
  styled,
  overrides as getOverrides,
} from './workflow-history-ungrouped-event.styles';
import { type Props } from './workflow-history-ungrouped-event.types';

export default function WorkflowHistoryUngroupedEvent({
  eventInfo,
  animateOnEnter,
  workflowStartTimeMs,
  onReset,
  decodedPageUrlParams,
  isExpanded,
  toggleIsExpanded,
}: Props) {
  const eventFilteringType = getEventGroupFilteringType(eventInfo.eventGroup);

  const overrides = getOverrides(eventFilteringType, animateOnEnter);

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  const { groupDetailsEntries, summaryDetailsEntries } = useMemo(
    () => generateHistoryGroupDetails(eventInfo.eventGroup),
    [eventInfo.eventGroup]
  );

  const eventSummaryDetails = summaryDetailsEntries.find(
    ([eventId]) => eventId === eventInfo.id
  )?.[1].eventDetails;

  const groupSummaryDetails = useMemo(
    () =>
      summaryDetailsEntries.flatMap(
        ([_eventId, { eventDetails }]) => eventDetails
      ),
    [summaryDetailsEntries]
  );

  const groupDetailsEntriesWithSummary = useMemo(
    () => [
      ...(groupSummaryDetails.length > 0 && groupDetailsEntries.length > 1
        ? [
            getSummaryTabContentEntry({
              groupId: eventInfo.eventGroup.firstEventId ?? 'unknown',
              summaryDetails: groupSummaryDetails,
            }),
          ]
        : []),
      ...groupDetailsEntries,
    ],
    [
      eventInfo.eventGroup.firstEventId,
      groupDetailsEntries,
      groupSummaryDetails,
    ]
  );

  return (
    <Panel
      title={
        <styled.HeaderContent>
          <MdOutlineCircle
            color={
              workflowHistoryEventFilteringTypeColorsConfig[eventFilteringType]
                .content
            }
          />
          <styled.HeaderLabel>{eventInfo.id}</styled.HeaderLabel>
          <styled.HeaderLabel>
            <WorkflowHistoryGroupLabel
              label={eventInfo.label}
              shortLabel={eventInfo.shortLabel}
            />
          </styled.HeaderLabel>
          <styled.StatusContainer>
            <WorkflowHistoryEventStatusBadge
              statusReady={true}
              size="small"
              status={eventInfo.eventMetadata.status}
            />
            {eventInfo.eventMetadata.label}
          </styled.StatusContainer>
          <div>
            {eventInfo.event.eventTime
              ? formatDate(parseGrpcTimestamp(eventInfo.event.eventTime))
              : null}
          </div>
          <div>
            {eventInfo.event.eventTime && workflowStartTimeMs
              ? getFormattedEventsDuration(
                  workflowStartTimeMs,
                  parseGrpcTimestamp(eventInfo.event.eventTime)
                )
              : null}
          </div>
          <styled.SummarizedDetailsContainer>
            {eventSummaryDetails && eventSummaryDetails.length > 0 ? (
              <WorkflowHistoryDetailsRow
                detailsEntries={eventSummaryDetails}
                {...decodedPageUrlParams}
              />
            ) : (
              <div />
            )}
          </styled.SummarizedDetailsContainer>
          <styled.ActionsContainer>
            {eventInfo.canReset && (
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
      expanded={isExpanded}
      onChange={toggleIsExpanded}
      overrides={overrides.panel}
    >
      <styled.GroupDetailsGridContainer>
        <styled.GroupDetailsNameSpacer />
        <styled.GroupDetailsContainer>
          <WorkflowHistoryGroupDetails
            groupDetailsEntries={groupDetailsEntriesWithSummary}
            initialEventId={eventInfo.id}
            workflowPageParams={decodedPageUrlParams}
            onClose={() => toggleIsExpanded()}
          />
        </styled.GroupDetailsContainer>
      </styled.GroupDetailsGridContainer>
    </Panel>
  );
}
