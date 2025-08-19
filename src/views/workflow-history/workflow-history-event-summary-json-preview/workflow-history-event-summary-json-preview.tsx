import WorkflowHistoryEventDetailsJson from '../workflow-history-event-details-json/workflow-history-event-details-json';
import { type EventSummaryValueComponentProps } from '../workflow-history-event-summary/workflow-history-event-summary.types';

import { styled } from './workflow-history-event-summary-json-preview.styles';

export default function WorkflowHistoryEventSummaryJsonPreview({
  name,
  value,
  isNegative,
}: EventSummaryValueComponentProps) {
  return (
    <styled.SummaryJsonContainer>
      <styled.SummaryJsonLabel>{name}</styled.SummaryJsonLabel>
      <WorkflowHistoryEventDetailsJson
        entryValue={value}
        isNegative={isNegative}
      />
    </styled.SummaryJsonContainer>
  );
}
