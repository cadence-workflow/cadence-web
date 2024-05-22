'use client';
import React from 'react';
import type { Props } from './workflow-page-tab-content.types';
import { worflowPageTabsContentsMapConfig } from '../config/workflow-page-tabs-contents-map.config';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { cssStyles } from './workflow-page-tab-content.styles';

export default function WorkflowPageTabContent({
  params,
  tabsContentMap = worflowPageTabsContentsMapConfig,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const selectedWorkflowTabName = params.workflowTab;
  const TabContent = tabsContentMap[selectedWorkflowTabName];
  if (TabContent)
    return (
      <div className={cls.tabContentContainer}>
        <TabContent params={params} />
      </div>
    );
  return null;
}
