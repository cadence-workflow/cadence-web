import { type ComponentType } from 'react';

import { type Config } from '@markdoc/markdoc';

export type Props = {
  markdown: string;
  domain?: string;
  cluster?: string;
  workflowId?: string;
  runId?: string;
  onActionSuccess?: () => void;
  extraTags?: Config['tags'];
  extraComponents?: Record<string, ComponentType<any>>;
};
