import { Panel } from 'baseui/accordion';
import { Badge } from 'baseui/badge';

import { type Timestamp } from '@/__generated__/proto-ts/google/protobuf/Timestamp';
import formatDate from '@/utils/data-formatters/format-date';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import WorkflowHistoryEventDetails from '../workflow-history-event-details/workflow-history-event-details';
import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';
import getFormattedEventsDuration from '../workflow-history-events-duration-badge/helpers/get-formatted-events-duration';

import getRetriesForHistoryEvent from './helpers/get-retries-for-history-event';
import { overrides, styled } from './workflow-history-ungrouped-card.styles';
import { type WorkflowHistoryUngroupedEventCardDetails } from './workflow-history-ungrouped-card.types';

export default function WorkflowHistoryUngroupedCard({
  cardDetails,
  workflowStartTime,
  decodedPageUrlParams,
  isExpanded,
  toggleIsExpanded,
}: {
  cardDetails: WorkflowHistoryUngroupedEventCardDetails;
  workflowStartTime: Timestamp | null;
  decodedPageUrlParams: WorkflowPageTabsParams;
  isExpanded: boolean;
  toggleIsExpanded: () => void;
}) {
  const retries = getRetriesForHistoryEvent(cardDetails.event);

  return (
    <styled.CardContainer>
      <Panel
        overrides={overrides.panel}
        title={
          <styled.CardHeaderContainer>
            <div>{cardDetails.id}</div>
            <div>{cardDetails.label}</div>
            <styled.CardStatusContainer>
              <WorkflowHistoryEventStatusBadge
                statusReady={true}
                size="small"
                status={cardDetails.status}
              />
              {cardDetails.statusLabel}
              {retries ? (
                <Badge
                  overrides={overrides.badge}
                  content={retries === 1 ? '1 retry' : `${retries} retries`}
                  shape="rectangle"
                  color="primary"
                />
              ) : null}
            </styled.CardStatusContainer>
            {cardDetails.event.eventTime && (
              <div>
                {formatDate(parseGrpcTimestamp(cardDetails.event.eventTime))}
              </div>
            )}
            {cardDetails.event.eventTime && workflowStartTime && (
              <div>
                {getFormattedEventsDuration(
                  parseGrpcTimestamp(workflowStartTime),
                  parseGrpcTimestamp(cardDetails.event.eventTime)
                )}
              </div>
            )}
          </styled.CardHeaderContainer>
        }
        expanded={isExpanded}
        onChange={() => toggleIsExpanded()}
      >
        <WorkflowHistoryEventDetails
          event={cardDetails.event}
          decodedPageUrlParams={decodedPageUrlParams}
        />
      </Panel>
    </styled.CardContainer>
  );
}
