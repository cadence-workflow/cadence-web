import type { Props as WorfklowHistoryProps } from '../workflow-history.types';

export type Props = {
  entryKey: string;
  entryPath: string;
  entryValue: any;
} & WorfklowHistoryProps['params'];
