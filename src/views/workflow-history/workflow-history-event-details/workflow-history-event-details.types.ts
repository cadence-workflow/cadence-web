import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

export type Props = {
  eventDetails: EventDetailsEntries;
  isScrollable?: boolean;
  workflowPageParams: WorkflowPageParams;
};

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

/**
 * Configuration object for customizing how event detail fields are rendered.
 * Each config must specify one of four matching strategies (key, path, pathRegex, or customMatcher)
 * to determine which fields it applies to.
 */
export type EventDetailsConfig = {
  /** Human-readable name for this configuration */
  name: string;
  /**
   * Optional function to customize the label displayed for matching fields.
   * If not provided, the field key is used as the label.
   */
  getLabel?: (args: EventDetailsFuncArgs) => string;
  /**
   * Optional React component to render the value for matching fields.
   * If not provided, the value is rendered as plain text.
   */
  valueComponent?: React.ComponentType<EventDetailsValueComponentProps>;
  /**
   * Optional function to hide matching fields from the display.
   */
  hide?: (args: EventDetailsFuncArgs) => boolean;
  /**
   * If true, displays matching fields in a separate panel section above the details list.
   * Useful for complex fields like JSON that benefit from dedicated display areas.
   */
  showInPanels?: boolean;
} & (
  | {
      /** Matches fields where the key exactly equals the specified string */
      key: string;
    }
  | {
      /** Matches fields where the full dot-separated path exactly equals the specified string */
      path: string;
    }
  | {
      /** Matches fields where the full dot-separated path matches the specified regex pattern */
      pathRegex: string;
    }
  | {
      /**
       * Matches fields using a custom function that receives the field context and returns a boolean.
       */
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
