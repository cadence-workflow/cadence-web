import type { PageTab } from '@/components/page-tabs/page-tabs.types';

import type workflowPageTabsConfig from '../config/workflow-page-tabs.config';
import { type WorkflowPageTabContent } from '../workflow-page-tab-content/workflow-page-tab-content.types';
import { type WorkflowPageTabErrorConfig } from '../workflow-page-tabs-error/workflow-page-tabs-error.types';

export type WorkflowPageTabConfig = {
  title: string;
  artwork: PageTab['artwork'];
  content: WorkflowPageTabContent;
  endEnhancer?: PageTab['endEnhancer'];
  getErrorConfig: (err: Error) => WorkflowPageTabErrorConfig;
};

export type WorkflowPageTabsConfig<K extends string> = Record<
  K,
  WorkflowPageTabConfig
>;

export type WorkflowPageTabName = keyof typeof workflowPageTabsConfig;

export type WorkflowPageTabsParams = {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  workflowTab: WorkflowPageTabName;
};
