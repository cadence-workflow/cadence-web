import React, { useMemo } from 'react';

import { StatefulTooltip } from 'baseui/tooltip';

import formatPendingWorkflowHistoryEvent from '@/utils/data-formatters/format-pending-workflow-history-event';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';

import isPendingHistoryEvent from '../workflow-history-event-details/helpers/is-pending-history-event';

import getHistoryEventSummaryFields from './helpers/get-history-event-summary-fields';
import { styled } from './workflow-history-event-summary.styles';
import { type Props } from './workflow-history-event-summary.types';

export default function WorkflowHistoryEventSummary({
  event,
  eventMetadata,
  ...workflowPageParams
}: Props) {
  const summaryFields = useMemo(() => {
    if (!eventMetadata.summaryFields) return [];

    const result = isPendingHistoryEvent(event)
      ? formatPendingWorkflowHistoryEvent(event)
      : formatWorkflowHistoryEvent(event);

    return result
      ? getHistoryEventSummaryFields({
          details: {
            ...result,
            ...eventMetadata.additionalDetails,
          },
          summaryFields: eventMetadata.summaryFields,
        })
      : [];
  }, [event, eventMetadata.summaryFields, eventMetadata.additionalDetails]);

  if (summaryFields.length === 0) return null;

  return (
    <styled.SummaryFieldsContainer>
      {summaryFields.map((field) => {
        const isNegative = Boolean(
          eventMetadata.negativeFields?.includes(field.path)
        );

        const Wrapper = ({ children }: { children: React.ReactNode }) =>
          field.hideDefaultTooltip ? (
            <>{children}</>
          ) : (
            <StatefulTooltip
              content={field.label}
              ignoreBoundary
              placement="bottom"
              showArrow
            >
              {children}
            </StatefulTooltip>
          );

        return (
          <Wrapper key={field.path}>
            <styled.SummaryFieldContainer $isNegative={isNegative}>
              {field.icon && <field.icon size={14} />}
              <field.renderValue
                label={field.label}
                value={field.value}
                isNegative={isNegative}
                {...workflowPageParams}
              />
            </styled.SummaryFieldContainer>
          </Wrapper>
        );
      })}
    </styled.SummaryFieldsContainer>
  );
}
