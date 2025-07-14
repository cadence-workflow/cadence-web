'use client';
import React from 'react';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import workflowPageTabsConfig from '../config/workflow-page-tabs.config';

import { cssStyles } from './workflow-page-tab-content.styles';
import type { Props } from './workflow-page-tab-content.types';

export default function WorkflowPageTabContent({ params }: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const selectedWorkflowTabName = params.workflowTab;
  const TabContent = workflowPageTabsConfig[selectedWorkflowTabName]?.content;

  if (TabContent)
    return (
      <div className={cls.tabContentContainer}>
        <TabContent params={params} />
      </div>
    );
  return null;
}
