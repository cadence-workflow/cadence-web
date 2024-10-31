import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import {
  type GetIsEventExpanded,
  type ToggleIsEventExpanded,
} from '../hooks/use-event-expansion-toggle.types';
import type {
  HistoryGroupEventMetadata,
  Props as WorfklowHistoryProps,
} from '../workflow-history.types';

export type Props = {
  events: HistoryEvent[];
  eventsMetadata: Pick<HistoryGroupEventMetadata, 'label' | 'status'>[];
  showEventPlaceholder?: boolean;
  decodedPageUrlParams: WorfklowHistoryProps['params'];
  getIsEventExpanded: GetIsEventExpanded;
  onEventToggle: ToggleIsEventExpanded;
};
