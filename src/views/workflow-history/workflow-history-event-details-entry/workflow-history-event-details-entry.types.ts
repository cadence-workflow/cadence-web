import {
  type EventDetailsConfig,
  type EventDetailsValueComponentProps,
} from '../workflow-history-event-details/workflow-history-event-details.types';

export type Props = EventDetailsValueComponentProps & {
  renderConfig: EventDetailsConfig | null;
};
