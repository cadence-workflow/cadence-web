import { styled } from './workflow-history-event-summary-json.styles';
import { type Props } from './workflow-history-event-summary-json.types';

export default function WorkflowHistoryEventSummaryJson({
  value,
  isNegative,
}: Props) {
  return (
    <styled.JsonViewContainer $isNegative={isNegative ?? false}>
      {JSON.stringify(value)}
    </styled.JsonViewContainer>
  );
}
