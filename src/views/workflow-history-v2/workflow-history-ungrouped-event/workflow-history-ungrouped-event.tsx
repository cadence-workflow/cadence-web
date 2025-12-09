import { styled } from './workflow-history-ungrouped-event.styles';
import { type Props } from './workflow-history-ungrouped-event.types';

export default function WorkflowHistoryUngroupedEvent({ eventInfo }: Props) {
  return (
    <styled.TempContainer>{JSON.stringify(eventInfo)}</styled.TempContainer>
  );
}
