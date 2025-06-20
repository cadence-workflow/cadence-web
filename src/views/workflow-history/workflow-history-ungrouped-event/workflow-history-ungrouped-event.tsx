import { Panel } from 'baseui/accordion';
import { Badge } from 'baseui/badge';
import { MdHourglassTop } from 'react-icons/md';

import formatDate from '@/utils/data-formatters/format-date';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import isPendingHistoryEvent from '../workflow-history-event-details/helpers/is-pending-history-event';
import WorkflowHistoryEventDetails from '../workflow-history-event-details/workflow-history-event-details';
import WorkflowHistoryEventLinkButton from '../workflow-history-event-link-button/workflow-history-event-link-button';
import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';
import getFormattedEventsDuration from '../workflow-history-events-duration-badge/helpers/get-formatted-events-duration';
import WorkflowHistoryGroupLabel from '../workflow-history-group-label/workflow-history-group-label';
import WorkflowHistoryTimelineResetButton from '../workflow-history-timeline-reset-button/workflow-history-timeline-reset-button';

import getRetriesForHistoryEvent from './helpers/get-retries-for-history-event';
import {
  overrides as getOverrides,
  styled,
} from './workflow-history-ungrouped-event.styles';
import { type Props } from './workflow-history-ungrouped-event.types';

export default function WorkflowHistoryUngroupedEvent({
  eventInfo,
  workflowStartTime,
  decodedPageUrlParams,
  isExpanded,
  toggleIsExpanded,
  animateBorderOnEnter,
  onReset,
}: Props) {
  const retries = getRetriesForHistoryEvent(eventInfo.event);
  const overrides = getOverrides(animateBorderOnEnter);

  return (
    <styled.CardContainer>
      <Panel
        overrides={overrides.panel}
        title={
          <styled.CardHeaderContainer>
            <styled.CardHeaderFieldContainer>
              {isPendingHistoryEvent(eventInfo.event) ? (
                <MdHourglassTop size={16} display="block" />
              ) : (
                eventInfo.id
              )}
            </styled.CardHeaderFieldContainer>
            <styled.CardHeaderFieldContainer>
              <styled.CardLabelContainer>
                <WorkflowHistoryGroupLabel
                  label={eventInfo.label}
                  shortLabel={eventInfo.shortLabel}
                />
                {isExpanded && (
                  <WorkflowHistoryEventLinkButton
                    historyEventId={eventInfo.id}
                    isUngroupedView
                  />
                )}
              </styled.CardLabelContainer>
            </styled.CardHeaderFieldContainer>
            <styled.CardStatusContainer>
              <WorkflowHistoryEventStatusBadge
                statusReady={true}
                size="small"
                status={eventInfo.status}
              />
              {eventInfo.statusLabel}
              {retries ? (
                <Badge
                  overrides={overrides.badge}
                  content={retries === 1 ? '1 retry' : `${retries} retries`}
                  shape="rectangle"
                  color="primary"
                />
              ) : null}
            </styled.CardStatusContainer>
            {eventInfo.event.eventTime ? (
              <styled.CardHeaderFieldContainer>
                {formatDate(parseGrpcTimestamp(eventInfo.event.eventTime))}
              </styled.CardHeaderFieldContainer>
            ) : (
              <div />
            )}
            {eventInfo.event.eventTime && workflowStartTime ? (
              <styled.CardHeaderFieldContainer>
                {getFormattedEventsDuration(
                  parseGrpcTimestamp(workflowStartTime),
                  parseGrpcTimestamp(eventInfo.event.eventTime)
                )}
              </styled.CardHeaderFieldContainer>
            ) : (
              <div />
            )}
            {typeof onReset === 'function' ? (
              <styled.ResetButtonContainer>
                <WorkflowHistoryTimelineResetButton
                  domain={decodedPageUrlParams.domain}
                  cluster={decodedPageUrlParams.cluster}
                  workflowId={decodedPageUrlParams.workflowId}
                  runId={decodedPageUrlParams.runId}
                  onReset={onReset}
                />
              </styled.ResetButtonContainer>
            ) : (
              <div />
            )}
          </styled.CardHeaderContainer>
        }
        expanded={isExpanded}
        onChange={() => toggleIsExpanded()}
      >
        <WorkflowHistoryEventDetails
          event={eventInfo.event}
          decodedPageUrlParams={decodedPageUrlParams}
        />
      </Panel>
    </styled.CardContainer>
  );
}
