'use client';
import React from 'react';

import { type Route } from 'next';
import { useParams } from 'next/navigation';

import DomainClusterSelector from '@/views/shared/domain-cluster-selector/domain-cluster-selector';
import type { BuildPathForClusterParams } from '@/views/shared/domain-cluster-selector/domain-cluster-selector.types';
import useSuspenseDomainDescription from '@/views/shared/hooks/use-domain-description/use-suspense-domain-description';

import type { Props } from './workflow-page-header-cluster-selector.types';
import { WorkflowPageTabsParams } from '../workflow-page-tabs/workflow-page-tabs.types';
import decodeUrlParams from '@/utils/decode-url-params';

export default function WorkflowPageHeaderClusterSelector({
  domain,
  cluster,
}: Props) {
  const { data: domainDescription } = useSuspenseDomainDescription({
    domain,
    cluster,
  });

  const encodedParams = useParams<WorkflowPageTabsParams>();
  const decodedParams = decodeUrlParams(encodedParams) as WorkflowPageTabsParams;

  const buildPathForCluster = ({
    newCluster,
    domainName,
  }: BuildPathForClusterParams) =>{
    const workflowTabSegment = encodedParams.workflowTab
    ? `/${encodedParams.workflowTab}`
    : '';
    return `/domains/${encodeURIComponent(domainName)}/${encodeURIComponent(newCluster)}/workflows/${encodedParams.workflowId}/${encodedParams.runId}${workflowTabSegment}` as Route;
  }

  return (
    <DomainClusterSelector
      domainDescription={domainDescription}
      cluster={decodedParams.cluster}
      buildPathForCluster={buildPathForCluster}
      singleClusterRender="none"
      noSpacing={true}
    />
  );
}
