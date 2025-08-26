import React, { useMemo } from 'react';

import { StatefulTooltip } from 'baseui/tooltip';

import formatPendingWorkflowHistoryEvent from '@/utils/data-formatters/format-pending-workflow-history-event';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';

import isPendingHistoryEvent from '../workflow-history-event-details/helpers/is-pending-history-event';

import getHistoryEventSummaryItems from './helpers/get-history-event-summary-items';
import { styled } from './workflow-history-event-summary.styles';
import { type Props } from './workflow-history-event-summary.types';

export default function WorkflowHistoryEventSummary({
  event,
  eventMetadata,
  shouldReverseRow,
  ...workflowPageParams
}: Props) {
  const summaryItems = useMemo(() => {
    if (!eventMetadata.summaryFields) return [];

    const result = isPendingHistoryEvent(event)
      ? formatPendingWorkflowHistoryEvent(event)
      : formatWorkflowHistoryEvent(event);

    return result
      ? getHistoryEventSummaryItems({
          details: {
            ...result,
            ...eventMetadata.additionalDetails,
          },
          summaryFields: eventMetadata.summaryFields,
        })
      : [];
  }, [event, eventMetadata.summaryFields, eventMetadata.additionalDetails]);

  if (summaryItems.length === 0) return null;

  return (
    <styled.SummaryFieldsContainer $reverse={shouldReverseRow}>
      {summaryItems.map((item) => {
        const isNegative = Boolean(
          eventMetadata.negativeFields?.includes(item.path)
        );

        const fieldContent = (
          <styled.SummaryFieldContainer $isNegative={isNegative}>
            {item.icon && <item.icon size={14} />}
            <item.renderValue
              label={item.label}
              value={item.value}
              isNegative={isNegative}
              {...workflowPageParams}
            />
          </styled.SummaryFieldContainer>
        );

        return item.hideDefaultTooltip ? (
          <React.Fragment key={item.path}>{fieldContent}</React.Fragment>
        ) : (
          <StatefulTooltip
            key={item.path}
            content={item.label}
            ignoreBoundary
            placement="bottom"
            showArrow
          >
            {fieldContent}
          </StatefulTooltip>
        );
      })}
    </styled.SummaryFieldsContainer>
  );
}
