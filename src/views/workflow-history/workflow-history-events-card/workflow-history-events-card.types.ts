import {
  type GetIsEventExpanded,
  type ToggleIsEventExpanded,
} from '../hooks/use-event-expansion-toggle.types';
import type {
  ExtendedHistoryEvent,
  HistoryGroupEventMetadata,
  Props as WorfklowHistoryProps,
} from '../workflow-history.types';

export type Props = {
  events: ExtendedHistoryEvent[];
  eventsMetadata: Pick<HistoryGroupEventMetadata, 'label' | 'status'>[];
  showEventPlaceholder?: boolean;
  decodedPageUrlParams: WorfklowHistoryProps['params'];
  getIsEventExpanded: GetIsEventExpanded;
  onEventToggle: ToggleIsEventExpanded;
};
