'use client';
import React from 'react';

import dynamic from 'next/dynamic';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

const DomainWorkflowsAdvanced = dynamic(
  () => import('./domain-workflows-advanced/domain-workflows-advanced')
);

export default function DomainWorkflowsAdvancedGate(
  props: DomainPageTabContentProps
) {
  const { data: isNewWorkflowsListEnabled } = useSuspenseConfigValue(
    'WORKFLOWS_LIST_ENABLED'
  );

  return (
    <DomainWorkflowsAdvanced
      domain={props.domain}
      cluster={props.cluster}
      isNewWorkflowsListEnabled={isNewWorkflowsListEnabled}
    />
  );
}
