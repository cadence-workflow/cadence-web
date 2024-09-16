import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import type { HistoryGroupEventMetadata } from '../workflow-history.types';

export type Props = {
  events: HistoryEvent[];
  eventsMetadata: Pick<HistoryGroupEventMetadata, 'label' | 'status'>[];
  showEventPlaceholder?: boolean;
};
