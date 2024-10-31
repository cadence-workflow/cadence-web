import {
  type GetIsEventExpanded,
  type ToggleIsEventExpanded,
} from '../hooks/use-event-expansion-toggle.types';
import type {
  HistoryEventsGroup,
  Props as WorkflowHistoryProps,
} from '../workflow-history.types';

export type Props = Pick<
  HistoryEventsGroup,
  | 'events'
  | 'eventsMetadata'
  | 'timeLabel'
  | 'label'
  | 'hasMissingEvents'
  | 'status'
> & {
  isLastEvent: boolean;
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  getIsEventExpanded: GetIsEventExpanded;
  onEventToggle: ToggleIsEventExpanded;
};
