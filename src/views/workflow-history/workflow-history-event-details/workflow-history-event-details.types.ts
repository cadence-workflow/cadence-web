import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import type {
  ExtendedHistoryEvent,
  Props as WorfklowHistoryProps,
} from '../workflow-history.types';

export type Props = {
  event: ExtendedHistoryEvent;
  negativeFields?: Array<string>;
  additionalDetails?: Record<string, any>;
  decodedPageUrlParams: WorfklowHistoryProps['params'];
};

export type WorkflowHistoryEventDetailsFuncArgs = {
  path: string;
  key: string;
  value: any;
};

export type WorkflowHistoryEventDetailsValueComponentProps = {
  entryKey: string;
  entryPath: string;
  entryValue: any;
  isNegative?: boolean;
} & WorkflowPageParams;

export type WorkflowHistoryEventDetailsConfig = {
  name: string;
  getLabel?: (args: WorkflowHistoryEventDetailsFuncArgs) => string;
  valueComponent?: React.ComponentType<WorkflowHistoryEventDetailsValueComponentProps>;
  hide?: (args: WorkflowHistoryEventDetailsFuncArgs) => boolean;
  forceWrap?: boolean;
} & (
  | { key: string }
  | { path: string }
  | { pathRegex: string }
  | {
      customMatcher: (args: WorkflowHistoryEventDetailsFuncArgs) => boolean;
    }
);

type WorkflowHistoryEventDetailsEntryBase = {
  key: string;
  path: string;
  isGroup?: boolean;
  isNegative?: boolean;
  renderConfig: WorkflowHistoryEventDetailsConfig | null;
};

export type WorkflowHistoryEventDetailsEntry =
  WorkflowHistoryEventDetailsEntryBase & {
    isGroup: false;
    value: any;
  };

export type WorkflowHistoryEventDetailsGroupEntry =
  WorkflowHistoryEventDetailsEntryBase & {
    isGroup: true;
    groupEntries: WorkflowHistoryEventDetailsEntries;
  };

export type WorkflowHistoryEventDetailsEntries = Array<
  WorkflowHistoryEventDetailsEntry | WorkflowHistoryEventDetailsGroupEntry
>;
