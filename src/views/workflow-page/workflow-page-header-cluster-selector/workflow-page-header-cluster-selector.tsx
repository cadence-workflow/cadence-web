'use client';
import React from 'react';

import { type Route } from 'next';
import { useParams } from 'next/navigation';

import DomainClusterSelector from '@/views/shared/domain-cluster-selector/domain-cluster-selector';
import type { BuildPathForClusterParams } from '@/views/shared/domain-cluster-selector/domain-cluster-selector.types';
import useSuspenseDomainDescription from '@/views/shared/hooks/use-domain-description/use-suspense-domain-description';

import { type WorkflowPageTabsParams } from '../workflow-page-tabs/workflow-page-tabs.types';

import type { Props } from './workflow-page-header-cluster-selector.types';

export default function WorkflowPageHeaderClusterSelector({
  domain,
  cluster,
}: Props) {
  const { data: domainDescription } = useSuspenseDomainDescription({
    domain,
    cluster,
  });

  const encodedParams = useParams<WorkflowPageTabsParams>();

  const buildPathForCluster = ({ newCluster }: BuildPathForClusterParams) => {
    const workflowTabSegment = encodedParams.workflowTab
      ? `/${encodedParams.workflowTab}`
      : '';
    return `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(newCluster)}/workflows/${encodedParams.workflowId}/${encodedParams.runId}${workflowTabSegment}` as Route;
  };

  return (
    <DomainClusterSelector
      domainDescription={domainDescription}
      cluster={cluster}
      buildPathForCluster={buildPathForCluster}
      singleClusterRender="none"
      noSpacing={true}
    />
  );
}
