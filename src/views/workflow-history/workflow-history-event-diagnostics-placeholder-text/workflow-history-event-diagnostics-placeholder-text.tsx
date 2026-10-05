import { styled } from './workflow-history-event-diagnostics-placeholder-text.styles';
import { type Props } from './workflow-history-event-diagnostics-placeholder-text.types';

export default function WorkflowHistoryEventDiagnosticsPlaceholderText({
  placeholderText,
}: Props) {
  return <styled.PlaceholderText>{placeholderText}</styled.PlaceholderText>;
}
