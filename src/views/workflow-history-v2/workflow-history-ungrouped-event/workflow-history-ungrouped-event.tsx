import { useCallback } from 'react';

import { Panel } from 'baseui/accordion';
import { MdOutlineCircle } from 'react-icons/md';

import formatDate from '@/utils/data-formatters/format-date';
import formatTimeDiff from '@/utils/datetime/format-time-diff';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import WorkflowHistoryGroupLabel from '@/views/workflow-history/workflow-history-group-label/workflow-history-group-label';
import WorkflowHistoryTimelineResetButton from '@/views/workflow-history/workflow-history-timeline-reset-button/workflow-history-timeline-reset-button';

import workflowHistoryEventGroupCategoryColorsConfig from '../config/workflow-history-event-group-category-colors.config';
import useGroupDetailsEntries from '../hooks/use-group-details-entries';
import WorkflowHistoryDetailsRow from '../workflow-history-details-row/workflow-history-details-row';
import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';
import { WORKFLOW_HISTORY_EVENT_GROUP_TYPE_TO_CATEGORY_MAP } from '../workflow-history-filters-menu/workflow-history-filters-menu.constants';
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
  onClickShowInTimeline,
}: Props) {
  const eventGroupCategory =
    WORKFLOW_HISTORY_EVENT_GROUP_TYPE_TO_CATEGORY_MAP[
      eventInfo.eventGroup.groupType
    ];

  const overrides = getOverrides(eventGroupCategory, animateOnEnter);

  const handleReset = useCallback(() => {
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  const { summaryDetailsEntries, groupDetailsEntriesWithSummary } =
    useGroupDetailsEntries(eventInfo.eventGroup);

  const eventSummaryDetails = summaryDetailsEntries.find(
    ([eventId]) => eventId === eventInfo.id
  )?.[1].eventDetails;

  return (
    <Panel
      title={
        <styled.HeaderContent>
          <MdOutlineCircle
            color={
              workflowHistoryEventGroupCategoryColorsConfig[eventGroupCategory]
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
              status={eventInfo.eventMetadata.status}
              statusText={eventInfo.eventMetadata.label}
            />
          </styled.StatusContainer>
          <div>
            {eventInfo.event.eventTime
              ? formatDate(parseGrpcTimestamp(eventInfo.event.eventTime))
              : null}
          </div>
          <div>
            {eventInfo.event.eventTime && workflowStartTimeMs
              ? formatTimeDiff(
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
            isUngroupedView={true}
            workflowPageParams={decodedPageUrlParams}
            onClose={() => toggleIsExpanded()}
            onClickShowInTimeline={onClickShowInTimeline}
          />
        </styled.GroupDetailsContainer>
      </styled.GroupDetailsGridContainer>
    </Panel>
  );
}
