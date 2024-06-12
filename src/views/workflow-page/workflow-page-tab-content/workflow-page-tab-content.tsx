'use client';
import React from 'react';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import workflowPageTabsContentsMapConfig from '../config/workflow-page-tabs-contents-map.config';

import { cssStyles } from './workflow-page-tab-content.styles';
import type { Props } from './workflow-page-tab-content.types';

export default function WorkflowPageTabContent({ params }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const selectedWorkflowTabName = params.workflowTab;
  const TabContent = workflowPageTabsContentsMapConfig[selectedWorkflowTabName];
  if (TabContent)
    return (
      <div className={cls.tabContentContainer}>
        <TabContent params={params} />
      </div>
    );
  return null;
}
