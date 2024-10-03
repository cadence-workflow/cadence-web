import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import type { Props as WorfklowHistoryProps } from '../workflow-history.types';

export type Props = {
  event: HistoryEvent;
  decodedPageUrlParams: WorfklowHistoryProps['params'];
};

export type WorkflowHistoryEventDetailsFuncArgs = {
  path: string;
  key: string;
  value: any;
};

export type WorkflowHistoryEventDetailsConfig = {
  name: string;
  getLabel?: (args: WorkflowHistoryEventDetailsFuncArgs) => string;
  valueComponent?: React.ComponentType<
    {
      entryKey: string;
      entryPath: string;
      entryValue: any;
    } & WorfklowHistoryProps['params']
  >;
  hide?: (args: WorkflowHistoryEventDetailsFuncArgs) => boolean;
} & (
  | { key: string }
  | { path: string }
  | { pathRegex: string }
  | {
      customMatcher: (args: WorkflowHistoryEventDetailsFuncArgs) => boolean;
    }
);

export type WorkflowHistoryEventDetailsEntry = {
  key: string;
  path: string;
  value: any;
  renderConfig?: WorkflowHistoryEventDetailsConfig | null;
};
