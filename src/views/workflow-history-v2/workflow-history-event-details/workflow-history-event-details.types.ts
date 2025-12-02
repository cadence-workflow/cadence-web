import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

export type EventDetailsFuncArgs = {
  path: string;
  key: string;
  value: any;
};

export type EventDetailsValueComponentProps = {
  entryKey: string;
  entryPath: string;
  entryValue: any;
  isNegative?: boolean;
} & WorkflowPageParams;

export type EventDetailsConfig = {
  name: string;
  getLabel?: (args: EventDetailsFuncArgs) => string;
  valueComponent?: React.ComponentType<EventDetailsValueComponentProps>;
  hide?: (args: EventDetailsFuncArgs) => boolean;
  showInPanels?: boolean;
} & (
  | { key: string }
  | { path: string }
  | { pathRegex: string }
  | {
      customMatcher: (args: EventDetailsFuncArgs) => boolean;
    }
);

type EventDetailsEntryBase = {
  key: string;
  path: string;
  isGroup?: boolean;
  isNegative?: boolean;
  renderConfig: EventDetailsConfig | null;
};

export type EventDetailsSingleEntry = EventDetailsEntryBase & {
  isGroup: false;
  value: any;
};

export type EventDetailsGroupEntry = EventDetailsEntryBase & {
  isGroup: true;
  groupEntries: EventDetailsEntries;
};

export type EventDetailsEntries = Array<
  EventDetailsSingleEntry | EventDetailsGroupEntry
>;
