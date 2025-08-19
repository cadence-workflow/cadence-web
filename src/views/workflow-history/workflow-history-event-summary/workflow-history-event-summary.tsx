import { useMemo } from 'react';

import { StatefulTooltip } from 'baseui/tooltip';

import formatPendingWorkflowHistoryEvent from '@/utils/data-formatters/format-pending-workflow-history-event';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';

import isPendingHistoryEvent from '../workflow-history-event-details/helpers/is-pending-history-event';

import getHistoryEventSummaryFields from './helpers/get-history-event-summary-fields';
import { overrides, styled } from './workflow-history-event-summary.styles';
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
      {summaryFields.map(({ name, value, renderConfig }) => {
        const isNegative = Boolean(
          eventMetadata.negativeFields?.includes(name)
        );

        if (
          renderConfig.shouldHide?.({
            name,
            value,
            isNegative,
            ...workflowPageParams,
          })
        ) {
          return null;
        }

        return (
          <StatefulTooltip
            key={name}
            content={
              renderConfig.renderHoverContent ? (
                <renderConfig.renderHoverContent
                  name={name}
                  value={value}
                  isNegative={isNegative}
                  {...workflowPageParams}
                />
              ) : (
                name
              )
            }
            overrides={
              renderConfig.invertPopoverColours
                ? overrides.popoverLight
                : overrides.popoverDark
            }
            ignoreBoundary
            placement="bottom"
            showArrow
          >
            <styled.SummaryFieldContainer $isNegative={isNegative}>
              {renderConfig.icon && <renderConfig.icon size={14} />}
              <renderConfig.renderValue
                name={name}
                value={value}
                isNegative={isNegative}
                {...workflowPageParams}
              />
            </styled.SummaryFieldContainer>
          </StatefulTooltip>
        );
      })}
    </styled.SummaryFieldsContainer>
  );
}
